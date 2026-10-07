/*
 * Vencord, a Discord client mod
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import definePlugin from "@utils/types";
import { Guild, RenderModalProps } from "@vencord/discord-types";
import {
    GuildMemberCountStore,
    GuildMemberStore,
    GuildStore,
    IconUtils,
    Menu,
    Modal,
    openModal,
    PresenceStore,
    React,
    showToast,
    SnowflakeUtils,
    UserStore
} from "@webpack/common";

/* Minimalist Clean Monochrome SVG Icons */
const Icons = {
    Shield: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    Users: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Activity: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    ),
    Smartphone: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    ),
    Monitor: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    ),
    Globe: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    UserX: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="18" y1="8" x2="23" y2="13" />
            <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
    ),
    Clock: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    AlertTriangle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    CheckCircle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
};

interface AnalysisResult {
    guild: Guild | undefined;
    guildName: string;
    totalGuildMembers: number;
    totalCached: number;
    totalOnline: number;
    officialBots: number;
    mobileUsers: number;
    desktopUsers: number;
    webOnlyUsers: number;
    defaultAvatarCount: number;
    newAccountCount: number;
    realPercent: number;
    botPercent: number;
    riskLevel: "safe" | "warn" | "danger";
    verdict: string;
}

function analyzeGuild(guildId: string): AnalysisResult | null {
    const guild = GuildStore.getGuild(guildId);
    const memberIds = new Set<string>();

    const memberList = GuildMemberStore.getMembers(guildId);
    if (Array.isArray(memberList)) {
        for (const m of memberList) {
            if (m?.userId) memberIds.add(m.userId);
        }
    }

    const memberIdList = GuildMemberStore.getMemberIds(guildId);
    if (Array.isArray(memberIdList)) {
        for (const id of memberIdList) {
            if (id) memberIds.add(id);
        }
    }

    try {
        const presences = PresenceStore.getState()?.presencesForGuilds?.[guildId];
        if (presences) {
            for (const userId of Object.keys(presences)) {
                memberIds.add(userId);
            }
        }
    } catch {}

    if (memberIds.size === 0) {
        return null;
    }

    const now = Date.now();
    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

    let totalOnline = 0;
    let officialBots = 0;
    let mobileUsers = 0;
    let desktopUsers = 0;
    let webOnlyUsers = 0;
    let defaultAvatarCount = 0;
    let newAccountCount = 0;

    for (const userId of memberIds) {
        const user = UserStore.getUser(userId);
        if (!user) continue;

        if (user.bot) {
            officialBots++;
            continue;
        }

        const clientStatus = PresenceStore.getClientStatus(userId);
        const status = PresenceStore.getStatus(userId, guildId);

        if (status === "offline" && (!clientStatus || Object.keys(clientStatus).length === 0)) {
            continue;
        }

        totalOnline++;
        const hasMobile = Boolean(clientStatus?.mobile);
        const hasDesktop = Boolean(clientStatus?.desktop);
        const hasWeb = Boolean(clientStatus?.web);

        if (hasMobile) mobileUsers++;
        if (hasDesktop) desktopUsers++;

        if (hasWeb && !hasDesktop && !hasMobile) {
            webOnlyUsers++;
        } else if (!hasMobile && !hasDesktop && !hasWeb) {
            webOnlyUsers++;
        }

        if (!user.avatar) {
            defaultAvatarCount++;
        }

        try {
            const createdAt = SnowflakeUtils.extractTimestamp(user.id);
            if (now - createdAt < FOURTEEN_DAYS_MS) {
                newAccountCount++;
            }
        } catch {}
    }

    if (totalOnline === 0) {
        return null;
    }

    const botRatio = (webOnlyUsers / totalOnline) * 100;
    const botPercent = Number(Math.min(100, Math.max(0, botRatio)).toFixed(1));
    const realPercent = Number((100 - botPercent).toFixed(1));

    let riskLevel: "safe" | "warn" | "danger" = "safe";
    let verdict = "This server consists mostly of organic users on mobile and desktop clients.";

    if (botPercent >= 50) {
        riskLevel = "danger";
        verdict = "Excessive web-only sessions detected! High probability of token bots or raid accounts.";
    } else if (botPercent >= 25) {
        riskLevel = "warn";
        verdict = "Web client ratio is noticeably elevated (25%+). Suspicious accounts or selfbots likely.";
    }

    return {
        guild,
        guildName: guild?.name ?? "Server",
        totalGuildMembers: GuildMemberCountStore?.getMemberCount(guildId) ?? guild?.memberCount ?? memberIds.size,
        totalCached: memberIds.size,
        totalOnline,
        officialBots,
        mobileUsers,
        desktopUsers,
        webOnlyUsers,
        defaultAvatarCount,
        newAccountCount,
        realPercent,
        botPercent,
        riskLevel,
        verdict
    };
}

function BotAnalysisModal({ result, modalProps }: { result: AnalysisResult; modalProps: RenderModalProps; }) {
    const { guild } = result;

    const iconUrl = guild?.icon && IconUtils.getGuildIconURL({
        id: guild.id,
        icon: guild.icon,
        canAnimate: true,
        size: 256
    });

    const bannerUrl = guild?.banner && IconUtils.getGuildBannerURL(guild, true)?.replace(/\?size=\d+$/, "?size=1024");

    return (
        <Modal
            {...modalProps}
            size="md"
            className="vc-bd-modal"
        >
            {/* Header Banner */}
            <div
                className="vc-bd-banner"
                style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : undefined}
            >
                <div className="vc-bd-banner-overlay" />
                <div className="vc-bd-header-content">
                    {iconUrl ? (
                        <img className="vc-bd-icon" src={iconUrl} alt="" />
                    ) : (
                        <div className="vc-bd-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "bold" }}>
                            {result.guildName.charAt(0)}
                        </div>
                    )}
                    <div className="vc-bd-title-box">
                        <h2 className="vc-bd-title">{result.guildName}</h2>
                        <div className="vc-bd-subtitle">
                            <Icons.Shield />
                            <span>Audience Security &amp; Bot Audit</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Body */}
            <div className="vc-bd-body">
                {/* Hero / Score Card */}
                <div className="vc-bd-hero-card">
                    <div className="vc-bd-scores">
                        <div className="vc-bd-score-badge vc-bd-score-real">
                            <span className="vc-bd-score-label">Real Humans</span>
                            <span className="vc-bd-score-val">{result.realPercent}%</span>
                        </div>
                        <div className="vc-bd-score-badge vc-bd-score-bot" style={{ alignItems: "flex-end" }}>
                            <span className="vc-bd-score-label">Bots / Suspicious</span>
                            <span className="vc-bd-score-val">{result.botPercent}%</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="vc-bd-progress-bar">
                        <div
                            className="vc-bd-progress-fill-real"
                            style={{ width: `${result.realPercent}%` }}
                        />
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="vc-bd-grid">
                    <div className="vc-bd-stat-card">
                        <div className="vc-bd-stat-icon"><Icons.Users /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">Total Members</span>
                            <span className="vc-bd-stat-value">{result.totalGuildMembers.toLocaleString()}</span>
                            <span className="vc-bd-stat-sub">Cached: {result.totalCached}</span>
                        </div>
                    </div>

                    <div className="vc-bd-stat-card">
                        <div className="vc-bd-stat-icon"><Icons.Activity /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">Active Online</span>
                            <span className="vc-bd-stat-value">{result.totalOnline} Users</span>
                            <span className="vc-bd-stat-sub">Official Bots: {result.officialBots}</span>
                        </div>
                    </div>

                    <div className="vc-bd-stat-card">
                        <div className="vc-bd-stat-icon"><Icons.Smartphone /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">Mobile Client</span>
                            <span className="vc-bd-stat-value">{result.mobileUsers}</span>
                            <span className="vc-bd-stat-sub" style={{ color: "#57f287" }}>Organic Audience</span>
                        </div>
                    </div>

                    <div className="vc-bd-stat-card">
                        <div className="vc-bd-stat-icon"><Icons.Monitor /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">Desktop Client</span>
                            <span className="vc-bd-stat-value">{result.desktopUsers}</span>
                            <span className="vc-bd-stat-sub">Trusted Audience</span>
                        </div>
                    </div>

                    <div className="vc-bd-stat-card">
                        <div className="vc-bd-stat-icon"><Icons.Globe /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">Web Only</span>
                            <span className="vc-bd-stat-value">{result.webOnlyUsers}</span>
                            <span className="vc-bd-stat-sub" style={{ color: "#ed4245" }}>Suspicious / Selfbot</span>
                        </div>
                    </div>

                    <div className="vc-bd-stat-card">
                        <div className="vc-bd-stat-icon"><Icons.UserX /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">No Avatar</span>
                            <span className="vc-bd-stat-value">{result.defaultAvatarCount}</span>
                            <span className="vc-bd-stat-sub">Default pfp</span>
                        </div>
                    </div>

                    <div className="vc-bd-stat-card" style={{ gridColumn: "span 2" }}>
                        <div className="vc-bd-stat-icon"><Icons.Clock /></div>
                        <div className="vc-bd-stat-details">
                            <span className="vc-bd-stat-title">Fresh Accounts</span>
                            <span className="vc-bd-stat-value">{result.newAccountCount} Accounts</span>
                            <span className="vc-bd-stat-sub">Created in the last 14 days</span>
                        </div>
                    </div>
                </div>

                {/* Verdict Box */}
                <div className={`vc-bd-verdict ${result.riskLevel}`}>
                    <span>
                        {result.riskLevel === "danger" || result.riskLevel === "warn" ? (
                            <Icons.AlertTriangle />
                        ) : (
                            <Icons.CheckCircle />
                        )}
                    </span>
                    <span>{result.verdict}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="vc-bd-footer">
                <button
                    className="vc-bd-btn vc-bd-btn-primary"
                    onClick={modalProps.onClose}
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}

function openBotAnalysisModal(result: AnalysisResult) {
    openModal(props => <BotAnalysisModal result={result} modalProps={props} />);
}

const makeContextMenuPatch = (): NavContextMenuPatchCallback => (children, { guild }: { guild: Guild; }) => {
    if (!guild?.id) return;

    const group = findGroupChildrenByChildId("privacy", children) ?? children;

    group.push(
        <Menu.MenuItem
            id="vc-bot-detector-analyze"
            label="Analyze Bot Ratio"
            action={() => {
                const res = analyzeGuild(guild.id);
                if (!res) {
                    showToast("⚠️ Insufficient member data. Scroll down the member list and try again.", "failure");
                    return;
                }

                openBotAnalysisModal(res);
                showToast(`Audit: ${res.realPercent}% Real | ${res.botPercent}% Bot`, "success");
            }}
        />
    );
};

export default definePlugin({
    name: "BotDetector",
    description: "Audits server members by client status (Mobile, Desktop, Web) and account age to calculate bot vs real user ratio.",
    authors: [{ name: "skeeyee404", id: 0n }],

    contextMenus: {
        "guild-context": makeContextMenuPatch(),
        "guild-header-popout": makeContextMenuPatch()
    }
});
