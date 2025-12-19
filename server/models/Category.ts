import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    created_at: Date;
    updated_at: Date;
}

const CategorySchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image_url: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default mongoose.model<ICategory>('Category', CategorySchema);
