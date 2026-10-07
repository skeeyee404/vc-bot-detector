<div align="center">

# 🛡️ BotDetector (Vencord Userplugin)

**Discord sunucularındaki bot, sahte ve organik kitle oranını analiz eden gelişmiş Vencord eklentisi.**

[![License: GPL-3.0](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Made for Vencord](https://img.shields.io/badge/Vencord-Userplugin-5865F2?logo=discord&logoColor=white)](https://vencord.dev)
[![Author](https://img.shields.io/badge/Author-skeeyee404-black)](https://github.com/skeeyee404)

</div>

---

## 🌟 Özellikler

- 📱 **Mobil & Masaüstü Ayrımı:** Gerçek organik kullanıcıları mobil ve masaüstü istemcilerine göre tespit eder.
- 🌐 **Web & Selfbot Tespiti:** Masaüstü veya mobil olmadan yalnızca web soketi açmış şüpheli / token raid hesaplarını ayrıştırır.
- 👤 **Varsayılan Avatar Analizi:** Profil resmi olmayan boş hesapları listeler.
- ⏳ **Hesap Yaşı Denetimi:** Discord Snowflake ID üzerinden son 14 günde açılmış taze bot/raid hesaplarını tespit eder.
- 📊 **Premium Dashboard UI:** Sunucu ikonu ve banner'ı ile uyumlu, saf beyaz minimalist vektör ikonlara ve çift renkli canlı ilerleme çubuğuna sahip açılır pencere.
- 🖱️ **Sağ Tık Menüsü Entegrasyonu:** Sunucu simgesine veya sunucu başlığına sağ tıklayıp tek tıkla analiz başlatabilme.

---

## 📸 Görünüm

- **Gerçek İnsan vs. Bot Oran Çubuğu** (Yeşil & Kırmızı degrade)
- **Detaylı İstatistik Izgarası:**
  - 👥 Toplam Üye & Önbellek Sayısı
  - 📈 Çevrimiçi Gerçek Kişi & Resmi Botlar
  - 📱 Mobil Bağlantılar *(Organik Kitle)*
  - 🖥️ Masaüstü Bağlantılar *(Güvenilir Kitle)*
  - 🌐 Yalnızca Web *(Şüpheli / Selfbot)*
  - 👤 Profil Resmi Olmayanlar
  - ⏳ Taze Hesaplar *(< 14 Gün)*
- **Otomatik Güvenlik & Risk Teşhisi** (Güvenli / Şüpheli / Yüksek Risk)

---

## 🚀 Kurulum

### 1. Dosyaları Vencord'a Ekleyin
Bu depoyu klonlayın veya indirin, ardından klasörü Vencord kaynak kodunuzdaki `src/userplugins/` dizinine taşıyın:

```bash
# Vencord proje dizininizde:
git clone https://github.com/skeeyee404/vc-bot-detector.git src/userplugins/botDetector
```

Veya klasörün içindeki `index.tsx` ve `styles.css` dosyalarını doğrudan `src/userplugins/botDetector/` klasörüne kopyalayın.

### 2. Vencord'u Derleyin
```bash
pnpm build
```

### 3. Discord'u Yenileyin
Discord açıkken klavyeden **`Ctrl + R`** basarak istemciyi yenileyin.

---

## 🕹️ Nasıl Kullanılır?

1. Analiz etmek istediğiniz herhangi bir Discord sunucusuna girin.
2. *(İpucu: Discord'un üye önbelleğini doldurmak için sağdaki üye listesini farenin tekerleğiyle hızlıca 1-2 tur aşağı kaydırın).*
3. Sol taraftaki **Sunucu İkonuna** veya sol üstteki **Sunucu Başlığı Menüsüne** sağ tıklayın.
4. **"Bot Oranını Analiz Et"** seçeneğine tıklayın.

---

## 👨‍💻 Geliştirici

- **Geliştirici:** [@skeeyee404](https://github.com/skeeyee404)
- **Lisans:** GPL-3.0-or-later
