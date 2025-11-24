import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function uploadPortraits() {
    console.log('🚀 Uploading portrait images...\n');

    const images = [
        'portrait-ctverec.jpeg',
        'hero_portrait.jpeg'
    ];

    const uploadedUrls = {};

    for (const imageName of images) {
        try {
            const filePath = `./images/${imageName}`;
            const fileBuffer = await readFile(filePath);

            const blob = await put(imageName, fileBuffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });

            uploadedUrls[imageName] = blob.url;
            console.log(`✅ Uploaded: ${imageName}`);
            console.log(`   URL: ${blob.url}\n`);
        } catch (error) {
            console.error(`❌ Failed to upload ${imageName}:`, error.message);
        }
    }

    console.log('\n✨ Upload complete!');
    console.log(`📊 Summary: ${Object.keys(uploadedUrls).length}/${images.length} images uploaded\n`);

    Object.entries(uploadedUrls).forEach(([name, url]) => {
        console.log(`${name}: ${url}`);
    });
}

uploadPortraits();
