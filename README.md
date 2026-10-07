<div align="center">

# 🛡️ BotDetector (Vencord Userplugin)

**An advanced Vencord userplugin that analyzes Discord servers to detect bot, fake, and organic user ratios based on client presence and account metadata.**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Made for Vencord](https://img.shields.io/badge/Vencord-Userplugin-5865F2?logo=discord&logoColor=white)](https://vencord.dev)
[![Author](https://img.shields.io/badge/Author-skeeyee404-black)](https://github.com/skeeyee404)

</div>

---

## 🌟 Features

- 📱 **Mobile & Desktop Detection:** Detects legitimate organic users connected via mobile and desktop clients.
- 🌐 **Web & Selfbot Identification:** Distinguishes suspicious token raid and selfbot accounts that only maintain a web WebSocket session without desktop or mobile clients.
- 👤 **Default Avatar Audit:** Tracks accounts that haven't set a profile avatar.
- ⏳ **Account Age Check:** Leverages Discord Snowflake timestamps to detect newly generated raid accounts created within the last 14 days.
- 📊 **Premium Dashboard UI:** Dark-mode modal dialog equipped with minimalist monochrome vector icons, guild banner & icon integration, and a dual progress comparison bar.
- 🖱️ **Context Menu Integration:** Seamlessly launches right from the Server icon or Server Header popout menu.

---

## 📸 Preview & Metrics

- **Real Human vs. Bot Ratio Bar** (Smooth green & red gradient bar)
- **Comprehensive Statistics Grid:**
  - 👥 Total Server Members & Cached Members
  - 📈 Active Online Members & Official Bots
  - 📱 Mobile Connections *(Most organic audience)*
  - 🖥️ Desktop Connections *(Trusted audience)*
  - 🌐 Web Only *(Suspicious / Potential Selfbot)*
  - 👤 Default Avatars *(No profile picture)*
  - ⏳ Fresh Accounts *(Created < 14 days ago)*
- **Automated Risk Verdict** (Safe / Suspicious / High Risk)

---

## 🚀 Installation

### 1. Add to your Vencord Source
Clone or download this repository directly into your Vencord `src/userplugins/` folder:

```bash
# Inside your Vencord root directory:
git clone https://github.com/skeeyee404/vc-bot-detector.git src/userplugins/botDetector
```

Alternatively, copy `index.tsx` and `styles.css` directly into `src/userplugins/botDetector/`.

### 2. Build Vencord
```bash
pnpm build
```

### 3. Reload Discord
Press **`Ctrl + R`** in Discord to apply the changes.

---

## 🕹️ Usage

1. Navigate to any Discord server you want to inspect.
2. *(Tip: Scroll down the member list on the right for 1-2 seconds to populate Discord's member cache).*
3. Right-click the **Server Icon** (left sidebar) or the **Server Header dropdown** (top left).
4. Click **"Analyze Bot Ratio"**.

---

## 👨‍💻 Author

- **Developer:** [@skeeyee404](https://github.com/skeeyee404)
- **License:** [GPL-3.0-or-later](LICENSE)
