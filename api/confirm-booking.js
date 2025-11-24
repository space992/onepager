import { resend, generateHash } from './utils/email-templates.js';
import { bookingClientConfirmedEmailTemplate } from './utils/booking-templates.js';

export default async function handler(req, res) {
    const { service, date, time, name, email, phone, key } = req.query;
    const packageName = req.query.package || '';
    const note = req.query.note || '';

    // For GET request, show the confirmation form
    if (req.method === 'GET') {
        // Verify the security hash
        const expectedHash = generateHash(email, date, time);
        if (key !== expectedHash) {
            return res.status(403).send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px; color: #44403c;">
            <h1 style="color: #dc2626;">❌ Neplatný odkaz</h1>
            <p>Tento odkaz není platný nebo již vypršel.</p>
          </body>
        </html>
      `);
        }

        // Show confirmation form with editable date/time
        return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Potvrzení rezervace - SW Beauty</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              background: #fafaf9;
              margin: 0;
              padding: 20px;
              color: #44403c;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              padding: 40px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            h1 {
              font-size: 32px;
              margin: 0 0 10px;
              color: #1c1917;
              font-weight: 300;
            }
            .subtitle {
              color: #78716c;
              font-size: 14px;
              margin: 0 0 30px;
            }
            .detail-box {
              background: #fafaf9;
              padding: 20px;
              margin: 20px 0;
              border-left: 3px solid #1c1917;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e7e5e4;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              color: #78716c;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            .value {
              font-weight: 500;
              color: #1c1917;
            }
            .form-group {
              margin: 20px 0;
            }
            .form-label {
              display: block;
              color: #78716c;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 8px;
            }
            input[type="date"], input[type="time"] {
              width: 100%;
              padding: 12px;
              border: 1px solid #d6d3d1;
              font-size: 14px;
              font-family: inherit;
            }
            input[type="date"]:focus, input[type="time"]:focus {
              outline: none;
              border-color: #1c1917;
            }
            .button {
              width: 100%;
              padding: 16px;
              background: #1c1917;
              color: white;
              border: none;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              cursor: pointer;
              margin-top: 20px;
            }
            .button:hover {
              background: #292524;
            }
            .button:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            .note {
              color: #78716c;
              font-size: 13px;
              margin-top: 20px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Potvrzení rezervace</h1>
            <p class="subtitle">SW Beauty</p>
            
            <div class="detail-box">
              <div class="detail-row">
                <span class="label">Klient</span>
                <span class="value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email</span>
                <span class="value">${email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Telefon</span>
                <span class="value">${phone}</span>
              </div>
              <div class="detail-row">
                <span class="label">Služba</span>
                <span class="value">${service}</span>
              </div>
              ${packageName ? `
              <div class="detail-row">
                <span class="label">Balíček</span>
                <span class="value">${packageName}</span>
              </div>
              ` : ''}
              ${note ? `
              <div class="detail-row">
                <span class="label">Poznámka</span>
                <span class="value">${note}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="label">Preferovaný termín</span>
                <span class="value">${date} v ${time}</span>
              </div>
            </div>

            <p style="font-size: 14px; color: #78716c; margin: 30px 0 20px;">
              Po telefonické domluvě s klientem zadejte finální termín:
            </p>

            <form id="confirmForm" method="POST">
              <input type="hidden" name="service" value="${service}">
              <input type="hidden" name="packageName" value="${packageName}">
              <input type="hidden" name="name" value="${name}">
              <input type="hidden" name="email" value="${email}">
              <input type="hidden" name="phone" value="${phone}">
              <input type="hidden" name="key" value="${key}">
              <input type="hidden" name="originalDate" value="${date}">
              <input type="hidden" name="originalTime" value="${time}">
              
              <div class="form-group">
                <label class="form-label" for="finalDate">Finální datum</label>
                <input type="date" id="finalDate" name="finalDate" value="${date}" required>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="finalTime">Finální čas</label>
                <input type="time" id="finalTime" name="finalTime" value="${time}" required>
              </div>
              
              <button type="submit" class="button" id="submitBtn">
                Potvrdit a odeslat klientovi
              </button>
            </form>

            <p class="note">
              Kliknutím na tlačítko odešlete potvrzovací email klientovi na adresu <strong>${email}</strong> s finálním termínem.
            </p>
          </div>

          <script>
            document.getElementById('confirmForm').addEventListener('submit', async (e) => {
              e.preventDefault();
              const btn = document.getElementById('submitBtn');
              btn.disabled = true;
              btn.textContent = 'Odesílám...';

              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData);

              try {
                const response = await fetch(window.location.pathname + window.location.search, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });

                if (response.ok) {
                  document.body.innerHTML = \`
                    <div style="max-width: 600px; margin: 100px auto; text-align: center; padding: 40px;">
                      <h1 style="font-size: 48px; margin: 0 0 20px; color: #15803d;">✓</h1>
                      <h2 style="font-size: 24px; margin: 0 0 10px; color: #1c1917;">Rezervace potvrzena</h2>
                      <p style="color: #78716c;">Email s potvrzením byl odeslán klientovi.</p>
                    </div>
                  \`;
                } else {
                  alert('Něco se pokazilo. Zkuste to prosím znovu.');
                  btn.disabled = false;
                  btn.textContent = 'Potvrdit a odeslat klientovi';
                }
              } catch (error) {
                alert('Chyba spojení. Zkuste to prosím znovu.');
                btn.disabled = false;
                btn.textContent = 'Potvrdit a odeslat klientovi';
              }
            });
          </script>
        </body>
      </html>
    `);
    }

    // For POST request, send confirmation email to client
    if (req.method === 'POST') {
        try {
            const body = req.body;
            const finalDate = body.finalDate;
            const finalTime = body.finalTime;

            // Verify the security hash with original date/time
            const expectedHash = generateHash(body.email, body.originalDate, body.originalTime);
            if (body.key !== expectedHash) {
                return res.status(403).json({ error: 'Invalid key' });
            }

            // Send confirmation email to client with final date/time
            await resend.emails.send({
                from: 'SW Beauty <noreply@swbeauty.cz>',
                to: body.email,
                subject: 'Potvrzení termínu - SW Beauty',
                html: bookingClientConfirmedEmailTemplate(
                    body.name,
                    body.service,
                    body.packageName,
                    finalDate,
                    finalTime
                )
            });

            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('Error confirming booking:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
