import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function uploadGiftCard() {
    console.log('🚀 Uploading gift card image...\n');

    try {
        const filePath = './images/gift-card-main.webp';
        const fileBuffer = await readFile(filePath);

        const blob = await put('gift-card-main.webp', fileBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log(`✅ Uploaded: gift-card-main.webp`);
        console.log(`📎 URL: ${blob.url}\n`);

        return blob.url;
    } catch (error) {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    }
}

uploadGiftCard();
