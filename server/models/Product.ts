import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    slug: string;
    short_description?: string;
    description?: string;
    images: string[];
    category_id?: mongoose.Types.ObjectId;
    specs: { label: string; value: string }[];
    price_range?: string;
    tags: string[];
    is_featured: boolean;
    created_at: Date;
    updated_at: Date;
}

const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    short_description: { type: String },
    description: { type: String },
    images: [{ type: String }],
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    specs: [{
        label: { type: String, required: true },
        value: { type: String, required: true }
    }],
    price_range: { type: String },
    tags: [{ type: String }],
    is_featured: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<IProduct>('Product', ProductSchema);
