// Booking email templates
export function bookingOwnerEmailTemplate(service, packageName, date, time, name, email, phone, note, confirmUrl) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #44403c; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e7e5e4; }
          .content { padding: 30px 0; }
          .button { display: inline-block; padding: 16px 32px; background: #1c1917; color: white; text-decoration: none; border-radius: 0; margin: 20px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; }
          .button:hover { background: #292524; }
          .details { background: #fafaf9; padding: 20px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e7e5e4; }
          .label { color: #78716c; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; }
          .value { font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #1c1917;">SW Beauty</h1>
            <p style="margin: 10px 0 0; color: #78716c; font-size: 12px;">Nová rezervace</p>
          </div>
          
          <div class="content">
            <h2 style="font-size: 20px; font-weight: 400;">Dobrý den,</h2>
            <p>Přišla nová žádost o rezervaci. Po telefonické domluvě s klientem potvrďte finální termín.</p>
            
            <div class="details">
              <div class="details-row">
                <span class="label">Služba</span>
                <span class="value">${service}</span>
              </div>
              ${packageName ? `
              <div class="details-row">
                <span class="label">Balíček</span>
                <span class="value">${packageName}</span>
              </div>
              ` : ''}
              <div class="details-row">
                <span class="label">Preferovaný datum</span>
                <span class="value">${date}</span>
              </div>
              <div class="details-row">
                <span class="label">Preferovaný čas</span>
                <span class="value">${time}</span>
              </div>
              <div class="details-row">
                <span class="label">Jméno</span>
                <span class="value">${name}</span>
              </div>
              <div class="details-row">
                <span class="label">Email</span>
                <span class="value">${email}</span>
              </div>
              <div class="details-row">
                <span class="label">Telefon</span>
                <span class="value">${phone}</span>
              </div>
              ${note ? `
              <div class="details-row" style="border: none; padding-top: 10px;">
                <span class="label">Poznámka</span>
              </div>
              <div style="padding: 10px 0; color: #57534e;">
                ${note}
              </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; padding: 20px 0;">
              <a href="${confirmUrl}" class="button">Potvrdit termín a odeslat klientovi</a>
            </div>
            
            <p style="color: #78716c; font-size: 13px; margin-top: 30px;">
              Kliknutím na tlačítko můžete upravit finální termín a odeslat potvrzení klientovi na email ${email}.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function bookingClientInitialEmailTemplate(name, service, packageName, date, time) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #44403c; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e7e5e4; }
          .content { padding: 30px 0; }
          .details { background: #fafaf9; padding: 20px; margin: 20px 0; border-left: 3px solid #1c1917; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #1c1917;">SW Beauty</h1>
            <p style="margin: 10px 0 0; color: #78716c; font-size: 12px;">Žádost o rezervaci</p>
          </div>
          
          <div class="content">
            <h2 style="font-size: 20px; font-weight: 400;">Děkujeme, ${name}</h2>
            <p>Vaše žádost o rezervaci byla úspěšně odeslána. Brzy vám zavoláme s potvrzením termínu.</p>
            
            <div class="details">
              <p style="margin: 0 0 10px; font-weight: 500; color: #1c1917;">${service}</p>
              ${packageName ? `<p style="margin: 0 0 10px; color: #78716c;">${packageName}</p>` : ''}
              <p style="margin: 10px 0 0; color: #78716c;">
                <strong>Preferovaný termín:</strong> ${date} v ${time}
              </p>
            </div>
            
            <p style="color: #78716c; font-size: 14px;">
              Po telefonické domluvě vám zašleme potvrzení s detaily a pokyny před návštěvou.
            </p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e7e5e4;">
              <p style="color: #a8a29e; font-size: 12px; margin: 0;">SW Beauty | swbeauty.cz</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function bookingClientConfirmedEmailTemplate(name, service, packageName, date, time) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #44403c; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e7e5e4; }
          .content { padding: 30px 0; }
          .confirmed-box { background: #f0fdf4; border: 2px solid #86efac; padding: 30px; margin: 20px 0; text-align: center; }
          .details { background: #fafaf9; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #1c1917;">SW Beauty</h1>
            <p style="margin: 10px 0 0; color: #78716c; font-size: 12px;">Potvrzení termínu</p>
          </div>
          
          <div class="content">
            <div class="confirmed-box">
              <h2 style="margin: 0 0 10px; font-size: 24px; color: #15803d;">✓ Termín potvrzen</h2>
              <p style="margin: 0; color: #166534;">Těšíme se na vás!</p>
            </div>
            
            <h2 style="font-size: 20px; font-weight: 400;">${name},</h2>
            <p>Váš termín byl úspěšně potvrzen. Detaily vaší návštěvy:</p>
            
            <div class="details">
              <p style="margin: 0 0 10px; font-size: 18px; font-weight: 500; color: #1c1917;">${service}</p>
              ${packageName ? `<p style="margin: 0 0 15px; color: #78716c;">${packageName}</p>` : ''}
              <p style="margin: 15px 0 0; padding-top: 15px; border-top: 1px solid #e7e5e4;">
                <strong style="color: #1c1917; font-size: 16px;">📅 ${date} v ${time}</strong>
              </p>
            </div>
            
            <div style="background: #fffbeb; border-left: 3px solid #fbbf24; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #78350f;">
                <strong>Pokyny před návštěvou:</strong><br>
                • Přijďte prosím 5 minut před začátkem<br>
                • Mějte s sebou pohodlné oblečení<br>
                • V případě změny nás kontaktujte telefonicky
              </p>
            </div>
            
            <p style="color: #78716c; font-size: 14px;">
              Adresa: [DOPLŇ ADRESU]<br>
              Telefon: [DOPLŇ TELEFON]
            </p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e7e5e4;">
              <p style="color: #a8a29e; font-size: 12px; margin: 0;">SW Beauty | swbeauty.cz</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
