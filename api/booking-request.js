import { resend, generateHash } from './utils/email-templates.js';
import { bookingOwnerEmailTemplate, bookingClientInitialEmailTemplate } from './utils/booking-templates.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { service, packageName, date, time, name, email, phone, note } = req.body;

        // Validate required fields
        if (!service || !date || !time || !name || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate secure hash for confirmation URL
        const hash = generateHash(email, date, time);
        const params = new URLSearchParams({
            service,
            date,
            time,
            name,
            email,
            phone,
            key: hash
        });

        if (packageName) {
            params.append('package', packageName);
        }

        if (note) {
            params.append('note', note);
        }

        const confirmUrl = `https://swbeauty.cz/api/confirm-booking?${params.toString()}`;

        // Send email to owner with confirmation link
        await resend.emails.send({
            from: 'SW Beauty <noreply@swbeauty.cz>',
            to: 'info@swbeauty.cz',
            subject: `Nová rezervace - ${name}`,
            html: bookingOwnerEmailTemplate(
                service,
                packageName || '',
                date,
                time,
                name,
                email,
                phone,
                note || '',
                confirmUrl
            )
        });

        // Send initial email to client
        await resend.emails.send({
            from: 'SW Beauty <noreply@swbeauty.cz>',
            to: email,
            subject: 'Žádost o rezervaci - SW Beauty',
            html: bookingClientInitialEmailTemplate(name, service, packageName || '', date, time)
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error processing booking:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
