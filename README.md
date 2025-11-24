# SW Beauty - Luxusní kosmetický salon

Profesionální one-page website pro SW Beauty s pokročilým booking systémem a dárkovými poukazy.

## 🎯 Funkcionality

- **Responsivní design** - optimalizováno pro mobil, tablet i desktop
- **Booking systém** - multi-step formulář s emailovým potvrzením
- **Dárkové poukazy** - konfigurovatelné poukazy s náhledem
- **Multi-modal přístroj** - ceník, rezervace, poukazy
- **Auto-hide navbar** - skrývá se při scrollu dolů
- **Email notifikace** - profesionální šablony přes Resend
- **Bezpečné potvrzení** - hash-based URL protection

## 🚀 Quick Start

### Instalace

```bash
npm install
```

### Lokální development

Pro testování frontendu:
```bash
npx serve .
# nebo
python3 -m http.server 8000
```

Pro testování včetně API:
```bash
vercel dev
```

## 🔧 Environment Variables

Vytvoř `.env.local` soubor s následujícími proměnnými:

```env
RESEND_API_KEY=re_xxxxx                    # Resend API klíč
VOUCHER_SECRET=min-20-znaku-random-string  # Tajný klíč pro zabezpečení
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx      # Vercel Blob token
```

**Vercel Production:**
Nastavit stejné environment variables v Vercel dashboard → Settings → Environment Variables.

## 📁 Struktura Projektu

```
onepager/
├── index.html              # Hlavní HTML soubor
├── app.js                  # Client-side JavaScript (nezapojeno)
├── api/                    # Vercel Serverless Functions
│   ├── booking-request.js      # Initial booking request
│   ├── confirm-booking.js      # Owner booking confirmation
│   ├── confirm-payment.js      # Voucher payment confirmation
│   ├── voucher-order.js        # Gift voucher order
│   └── utils/
│       ├── email-templates.js      # Email helpers & Resend config
│       └── booking-templates.js    # HTML email templates
├── services.csv            # Databáze služeb
├── prices.csv              # Databáze cen
└── images/                 # Lokální obrázky (většina na Vercel Blob)
```

## 📧 Email Flows

### Booking Flow

1. **Klient vyplní formulář** → `/api/booking-request`
   - Owner dostane email s odkazem na potvrzení
   - Klient dostane initial email s informací o žádosti

2. **Owner klikne na odkaz** → `/api/confirm-booking` (GET)
   - Zobrazí se potvrzovací formulář
   - Může upravit finální datum/čas po telefonátu

3. **Owner potvrdí** → `/api/confirm-booking` (POST)
   - Klient dostane finální email s potvrzeným termínem

### Voucher Flow

1. **Klient vyplní formulář** → `/api/voucher-order`
   - Owner dostane email s odkazem "Potvrdit platbu a odeslat"

2. **Owner klikne po přijetí platby** → `/api/confirm-payment`
   - Klient automaticky dostane krásný email s poukazem

## 🔐 Security

- **Hash-based URL protection** - všechny confirmation linky jsou zabezpečené
- **Environment variables** - žádné secrets v kódu
- **Input validation** - na všech API endpointech
- **HTTPS only** - Vercel automaticky

## 🎨 Design System

- **Font:** Cormorant Garamond (headers) + Geist (body)
- **Barvy:** Stone palette (neutral, luxusní feel)
- **Framework:** Vanilla HTML/CSS/JS + Tailwind CDN
- **Icons:** Lucide Icons

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Large: > 1920px (speciální alignment fix)

## 🚢 Deployment

### GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

### Vercel (automatický deploy z GitHub)

Vercel automaticky deployuje z GitHub repo. Nebo manuálně:

```bash
vercel --prod
```

## 📝 Poznámky

- Projekt používá Vercel Blob Storage pro obrázky
- Email systém běží přes Resend API
- Serverless functions jsou auto-deployed s HTML
- Žádný build step není potřeba (vanilla JS)

## 🔗 Užitečné Odkazy

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Resend Dashboard](https://resend.com/emails)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

## 📞 Kontakt

Pro podporu a otázky: info@swbeauty.cz
