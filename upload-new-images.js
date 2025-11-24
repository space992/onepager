import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const imagesToUpload = [
    'dermapen.png',
    'salon_cekarna.png',
    'salon_room1.png'
];

async function uploadNewImages() {
    const uploadedImages = {};

    for (const filename of imagesToUpload) {
        try {
            const filePath = path.join('images', filename);
            const fileBuffer = fs.readFileSync(filePath);

            console.log(`Uploading ${filename}...`);

            const blob = await put(filename, fileBuffer, {
                access: 'public',
            });

            uploadedImages[filename] = blob.url;
            console.log(`✓ Uploaded: ${blob.url}`);

        } catch (error) {
            console.error(`✗ Failed to upload ${filename}:`, error.message);
        }
    }

    // Save to uploaded-images.json
    const existingData = JSON.parse(fs.readFileSync('uploaded-images.json', 'utf-8'));
    const updatedData = { ...existingData, ...uploadedImages };
    fs.writeFileSync('uploaded-images.json', JSON.stringify(updatedData, null, 2));

    console.log('\n📄 Updated uploaded-images.json');
    console.log('\nNew URLs:');
    Object.entries(uploadedImages).forEach(([name, url]) => {
        console.log(`${name}: ${url}`);
    });
}

uploadNewImages();
