import express from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

const router = express.Router();

// Get all products with optional filters
router.get('/', async (req, res) => {
    try {
        const { slug, category_id, exclude_id, limit, page } = req.query;
        const query: any = {};

        if (slug) query.slug = slug;
        if (category_id) query.category_id = category_id;
        if (exclude_id) query._id = { $ne: exclude_id };

        let queryBuilder = Product.find(query)
            .populate('category_id')
            .sort({ is_featured: -1, title: 1 });

        if (page && limit) {
            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const skip = (pageNum - 1) * limitNum;
            queryBuilder = queryBuilder.skip(skip).limit(limitNum);
        } else if (limit) {
            queryBuilder = queryBuilder.limit(parseInt(limit as string));
        }

        const products = await queryBuilder.exec();

        // Transform to match Supabase response structure roughly
        const transformed = products.map(p => {
            const doc = p.toObject();
            return {
                ...doc,
                id: doc._id,
                // Map populated category_id to category field to match frontend expectation
                category: doc.category_id,
                // Keep category_id as the ID string if possible
                category_id: (doc.category_id as any)?._id || doc.category_id
            };
        });

        res.json(transformed);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// ... (previous GET routes)

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id');
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const doc = product.toObject();
        const transformed = {
            ...doc,
            id: doc._id,
            category: doc.category_id,
            category_id: (doc.category_id as any)?._id || doc.category_id
        };

        res.json(transformed);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

import { requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

// Create product
router.post('/', requireAdmin, upload.array('images', 5), async (req: any, res: any) => {
    try {
        const { title, slug, description, short_description, price_range, category_id, is_featured, specs, tags } = req.body;

        let images: string[] = [];
        if (req.files) {
            images = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
        }

        // Parse JSON strings back to objects if they came from FormData
        const parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        const product = new Product({
            title,
            slug,
            description,
            short_description,
            price_range,
            category_id,
            is_featured: is_featured === 'true' || is_featured === true,
            specs: parsedSpecs,
            tags: parsedTags,
            images
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Update product
router.put('/:id', requireAdmin, upload.array('images', 5), async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (req.files && req.files.length > 0) {
            const newImages = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
            // Append or replace? Let's assume replace or append based on logic. 
            // For simplicity in this demo, let's append if 'appendImages' flag, or replace.
            // Actually, simplest is to let frontend handle it: send existing images as URLs in body, new images in files.
            // But typical FormData flow is tricky. Let's just add new images to existing list if 'images' field in body is present.

            // Allow merging with existing images passed as strings
            let currentImages = updates.existingImages || [];
            if (typeof currentImages === 'string') currentImages = [currentImages];

            updates.images = [...currentImages, ...newImages];
            delete updates.existingImages;
        }

        if (updates.specs && typeof updates.specs === 'string') updates.specs = JSON.parse(updates.specs);
        if (updates.tags && typeof updates.tags === 'string') updates.tags = JSON.parse(updates.tags);

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Delete product
router.delete('/:id', requireAdmin, async (req: any, res: any) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;
