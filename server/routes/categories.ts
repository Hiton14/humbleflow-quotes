import express from 'express';
import Category from '../models/Category';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ title: 1 });
        const transformed = categories.map(c => ({
            ...c.toObject(),
            id: c._id
        }));
        res.json(transformed);
        // ... (GET route)
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

import { requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

// Create category
router.post('/', requireAdmin, upload.single('image'), async (req: any, res: any) => {
    try {
        const { title, slug, description } = req.body;
        let image_url = req.body.image_url;

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const category = new Category({
            title,
            slug,
            description,
            image_url
        });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Update category
router.put('/:id', requireAdmin, upload.single('image'), async (req: any, res: any) => {
    try {
        const { title, slug, description } = req.body;
        const updates: any = { title, slug, description };

        if (req.file) {
            updates.image_url = `/uploads/${req.file.filename}`;
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Delete category
router.delete('/:id', requireAdmin, async (req: any, res: any) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;
