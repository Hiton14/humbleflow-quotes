import mongoose from 'mongoose';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { basename } from 'path';

// Load env vars
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humbleflow';

// Sanity Client
const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN, // Must have write token
    useCdn: false,
    apiVersion: '2023-05-03',
});

// MongoDB Models (Inline definition to avoid import issues if files are gone/changed)
const productSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    short_description: String,
    price_range: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    is_featured: Boolean,
    specs: Array,
    tags: Array,
    images: Array,
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    image_url: String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // 1. Migrate Categories
        console.log('Fetching categories...');
        const categories = await Category.find();
        console.log(`Found ${categories.length} categories.`);

        const categoryIdMap: Record<string, string> = {};

        for (const cat of categories) {
            console.log(`Migrating category: ${cat.title}`);

            // Upload image if exists (assuming it's a local path /uploads/...)
            let imageAssetId = null;
            if (cat.image_url && cat.image_url.startsWith('/uploads/')) {
                const filePath = path.join(process.cwd(), 'server', cat.image_url);
                if (fs.existsSync(filePath)) {
                    try {
                        const buffer = fs.readFileSync(filePath);
                        const asset = await client.assets.upload('image', buffer, { filename: basename(filePath) });
                        imageAssetId = asset._id;
                    } catch (e) {
                        console.error(`Failed to upload image for category ${cat.title}:`, e);
                    }
                }
            }

            const doc = {
                _type: 'category',
                title: cat.title,
                slug: { _type: 'slug', current: cat.slug },
                description: cat.description,
                ...(imageAssetId && { image: { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } })
            };

            const created = await client.create(doc);
            categoryIdMap[cat._id.toString()] = created._id;
            console.log(`Migrated category ${cat.title} -> ${created._id}`);
        }

        // 2. Migrate Products
        console.log('Fetching products...');
        const products = await Product.find();
        console.log(`Found ${products.length} products.`);

        for (const prod of products) {
            console.log(`Migrating product: ${prod.title}`);

            // Upload images
            const galleryImages = [];
            if (prod.images && prod.images.length > 0) {
                for (const imgUrl of prod.images) {
                    if (imgUrl.startsWith('/uploads/')) {
                        const filePath = path.join(process.cwd(), 'server', imgUrl);
                        if (fs.existsSync(filePath)) {
                            try {
                                const buffer = fs.readFileSync(filePath);
                                const asset = await client.assets.upload('image', buffer, { filename: basename(filePath) });
                                galleryImages.push({
                                    _type: 'image',
                                    asset: { _type: 'reference', _ref: asset._id }
                                });
                            } catch (e) {
                                console.error(`Failed to upload image for product ${prod.title}:`, e);
                            }
                        }
                    }
                }
            }

            const doc = {
                _type: 'product',
                title: prod.title,
                slug: { _type: 'slug', current: prod.slug },
                description: prod.description,
                short_description: prod.short_description,
                price_range: prod.price_range,
                is_featured: prod.is_featured,
                specs: prod.specs,
                tags: prod.tags,
                images: galleryImages,
                ...(prod.category_id && categoryIdMap[prod.category_id.toString()] && {
                    category: {
                        _type: 'reference',
                        _ref: categoryIdMap[prod.category_id.toString()]
                    }
                })
            };

            await client.create(doc);
            console.log(`Migrated product ${prod.title}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
