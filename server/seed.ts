import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category';
import Product from './models/Product';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/humbleflow';

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create Categories
        const categories = await Category.insertMany([
            {
                title: 'Water Filters',
                slug: 'water-filters',
                description: 'High quality water filters for home and business.',
                image_url: 'https://images.unsplash.com/photo-1585832626500-11e2d93e2g33?auto=format&fit=crop&q=80&w=200'
            },
            {
                title: 'Purifiers',
                slug: 'purifiers',
                description: 'Advanced purification systems.',
                image_url: 'https://images.unsplash.com/photo-1521791206122-c3248386e8fe?auto=format&fit=crop&q=80&w=200'
            }
        ]);
        console.log('Categories created');

        // Create Products
        await Product.insertMany([
            {
                title: 'Premium Water Filter',
                slug: 'premium-water-filter',
                short_description: 'Best in class filtration.',
                description: 'Long description about the premium water filter...',
                images: ['https://images.unsplash.com/photo-1585832626500-11e2d93e2g33?auto=format&fit=crop&q=80&w=400'],
                category_id: categories[0]._id,
                specs: [{ label: 'Capacity', value: '10L' }, { label: 'Material', value: 'Steel' }],
                price_range: '$100 - $150',
                tags: ['home', 'premium'],
                is_featured: true
            },
            {
                title: 'Industrial Purifier',
                slug: 'industrial-purifier',
                short_description: 'For large scale needs.',
                description: 'Long description about the industrial purifier...',
                images: ['https://images.unsplash.com/photo-1521791206122-c3248386e8fe?auto=format&fit=crop&q=80&w=400'],
                category_id: categories[1]._id,
                specs: [{ label: 'Capacity', value: '1000L' }],
                price_range: 'Contact for price',
                tags: ['industrial'],
                is_featured: false
            }
        ]);
        console.log('Products created');

        await mongoose.disconnect();
        console.log('Done!');
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();
