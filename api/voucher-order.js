import { resend, generateHash, ownerEmailTemplate } from './utils/email-templates.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { recipientName, recipientEmail, message, voucherType, amount, service } = req.body;

        // Validate required fields
        if (!recipientName || !recipientEmail || !voucherType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (voucherType === 'cash' && !amount) {
            return res.status(400).json({ error: 'Amount is required for cash voucher' });
        }

        if (voucherType === 'service' && !service) {
            return res.status(400).json({ error: 'Service is required for service voucher' });
        }

        // Generate secure hash for confirmation URL
        const hash = generateHash(recipientEmail, amount || '', service || '');
        const params = new URLSearchParams({
            email: recipientEmail,
            name: recipientName,
            type: voucherType,
            key: hash
        });

        if (voucherType === 'cash') {
            params.append('amount', amount);
        } else {
            params.append('service', service);
        }

        if (message) {
            params.append('message', message);
        }

        const confirmUrl = `https://swbeauty.cz/api/confirm-payment?${params.toString()}`;

        // Send email to owner with confirmation link
        await resend.emails.send({
            from: 'SW Beauty <noreply@swbeauty.cz>',
            to: 'info@swbeauty.cz',
            subject: `Nová objednávka poukazu - ${recipientName}`,
            html: ownerEmailTemplate(
                recipientName,
                recipientEmail,
                voucherType,
                amount || '',
                service || '',
                message || '',
                confirmUrl
            )
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error processing voucher order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
