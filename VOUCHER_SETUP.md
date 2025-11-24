# Poukázový systém - Nastavení

## Co potřebuješ přidat do `.env.local`:

```env
RESEND_API_KEY=re_xxx  # Tvůj Resend API klíč (už máš)
VOUCHER_SECRET=vykopiruj-si-tenhle-random-string-12345abcde
```

**Důležité:** `VOUCHER_SECRET` je tajný klíč pro zabezpečení odkazů. Vygeneruj si nějaký náhodný string (minimálně 20 znaků).

## Nastavení na Vercelu:

1. Přidej tyto environment variables na Vercelu:
   - `RESEND_API_KEY` - tvůj Resend klíč
   - `VOUCHER_SECRET` - stejný string jako v `.env.local`

2. Deploy projekt

## Jak to funguje:

### Poukazy:
1.  Klient vyplní formulář na webu → odešle se na `/api/voucher-order`
2. **Dostaneš email** (info@swbeauty.cz) s odkazem "Potvrdit platbu a odeslat poukaz"
3. Klikneš na odkaz → klient automaticky dostane krásný poukaz na email
4. Žádný admin panel, žádné přihlašování

### Hotově!
