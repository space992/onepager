import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to generate security hash
export function generateHash(email, amount, service = '') {
    const secret = process.env.VOUCHER_SECRET || 'default-secret-change-me';
    const data = `${email}-${amount}-${service}-${secret}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Email template for owner with confirmation link
export function ownerEmailTemplate(recipientName, recipientEmail, voucherType, amount, service, message, confirmUrl) {
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
          .label { color: #78716c; text

-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; }
          .value { font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: -0.02em; color: #1c1917;">SW Beauty</h1>
            <p style="margin: 10px 0 0; color: #78716c; font-size: 12px;">Nová objednávka poukazu</p>
          </div>
          
          <div class="content">
            <h2 style="font-size: 20px; font-weight: 400;">Dobrý den,</h2>
            <p>Přišla nová objednávka dárkového poukazu. Po přijetí platby klikněte na tlačítko níže pro odeslání poukazu klientovi.</p>
            
            <div class="details">
              <div class="details-row">
                <span class="label">Obdarovaný</span>
                <span class="value">${recipientName}</span>
              </div>
              <div class="details-row">
                <span class="label">Email</span>
                <span class="value">${recipientEmail}</span>
              </div>
              <div class="details-row">
                <span class="label">Typ</span>
                <span class="value">${voucherType === 'cash' ? 'Na částku' : 'Na proceduru'}</span>
              </div>
              <div class="details-row">
                <span class="label">Hodnota</span>
                <span class="value">${voucherType === 'cash' ? `${amount} Kč` : service}</span>
              </div>
              ${message ? `
              <div class="details-row" style="border: none; padding-top: 10px;">
                <span class="label">Věnování</span>
              </div>
              <div style="padding: 10px 0; font-style: italic; color: #57534e;">
                "${message}"
              </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; padding: 20px 0;">
              <a href="${confirmUrl}" class="button">Potvrdit platbu a odeslat poukaz</a>
            </div>
            
            <p style="color: #78716c; font-size: 13px; margin-top: 30px;">
              Kliknutím na tlačítko potvrdíte přijetí platby a poukaz bude automaticky odeslán na email ${recipientEmail}.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export { resend };
