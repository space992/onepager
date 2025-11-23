import { put, list } from '@vercel/blob';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const IMAGES_DIR = './images';

async function uploadImages() {
    console.log('🚀 Starting image upload to Vercel Blob...\n');

    try {
        // Get all files from images directory
        const files = await readdir(IMAGES_DIR);
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        console.log(`Found ${imageFiles.length} images to upload\n`);

        const uploadedUrls = {};

        for (const file of imageFiles) {
            try {
                const filePath = join(IMAGES_DIR, file);
                const fileBuffer = await readFile(filePath);

                // Upload to Vercel Blob
                const blob = await put(file, fileBuffer, {
                    access: 'public',
                    token: process.env.BLOB_READ_WRITE_TOKEN,
                });

                uploadedUrls[file] = blob.url;
                console.log(`✅ Uploaded: ${file}`);
                console.log(`   URL: ${blob.url}\n`);
            } catch (error) {
                console.error(`❌ Failed to upload ${file}:`, error.message);
            }
        }

        // Save URLs to a JSON file for reference
        const urlsJson = JSON.stringify(uploadedUrls, null, 2);
        const { writeFile } = await import('fs/promises');
        await writeFile('uploaded-images.json', urlsJson);

        console.log('\n✨ Upload complete!');
        console.log(`📦 URLs saved to: uploaded-images.json`);
        console.log(`\n📊 Summary: ${Object.keys(uploadedUrls).length}/${imageFiles.length} images uploaded`);

    } catch (error) {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    }
}

uploadImages();
