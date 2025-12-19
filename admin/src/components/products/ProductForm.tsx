"use client";
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash, Plus } from 'lucide-react';

// Schema
const productSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    category_id: z.string().min(1, "Category is required"),
    short_description: z.string().optional(),
    description: z.string().optional(),
    price_range: z.string().optional(),
    is_featured: z.boolean().default(false),
    specs: z.array(z.object({
        label: z.string().min(1),
        value: z.string().min(1)
    })).optional(),
    tags: z.string().optional(), // Comma separated string for simplicity in form
});

interface ProductFormProps {
    initialData?: any;
    categories: any[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter();
    const [images, setImages] = useState<(string | File)[]>([]);
    const [loading, setLoading] = useState(false);

    const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            ...initialData,
            category_id: initialData.category?.id || initialData.category_id,
            // Convert tags array to string
            tags: initialData.tags?.join(', ') || '',
        } : {
            title: '',
            slug: '',
            category_id: '',
            short_description: '',
            description: '',
            price_range: '',
            is_featured: false,
            specs: [],
            tags: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "specs"
    });

    useEffect(() => {
        if (initialData?.images) {
            setImages(initialData.images);
        }
    }, [initialData]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('slug', data.slug);
            formData.append('category_id', data.category_id);
            formData.append('short_description', data.short_description || '');
            formData.append('description', data.description || '');
            formData.append('price_range', data.price_range || '');
            formData.append('is_featured', String(data.is_featured));
            formData.append('specs', JSON.stringify(data.specs || []));

            // Handle tags
            const tagsArray = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
            formData.append('tags', JSON.stringify(tagsArray));

            // Handle images
            // Separate existing (strings) and new (Files)
            const existingImages = images.filter(img => typeof img === 'string');
            const newFiles = images.filter(img => img instanceof File) as File[];

            // For existing images, we might need to send them to backend to tell what to keep
            // Backend implementation:
            // "let currentImages = updates.existingImages || [];"
            existingImages.forEach((img) => {
                formData.append('existingImages', img as string);
            });

            newFiles.forEach((file) => {
                formData.append('images', file);
            });

            if (initialData) {
                await api.put(`/products/${initialData.id}`, formData);
                toast.success('Product updated');
            } else {
                await api.post('/products', formData);
                toast.success('Product created');
            }
            router.push('/admin/products');
            router.refresh();
        } catch (err) {
            toast.error('Something went wrong');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input {...register('title')} />
                    {errors.title && <p className="text-red-500 text-sm">{(errors.title as any).message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <Input {...register('slug')} />
                    {errors.slug && <p className="text-red-500 text-sm">{(errors.slug as any).message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                        {...register('category_id')}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-sm">{(errors.category_id as any).message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <Input {...register('price_range')} placeholder="e.g. $1000 - $2000" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Input {...register('short_description')} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                    {...register('description')}
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register('is_featured')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    <span className="text-sm font-medium">Featured Product</span>
                </label>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                <MultiImageUpload
                    value={images}
                    onChange={setImages}
                    onRemove={(index) => setImages(images.filter((_, i) => i !== index))}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Specifications</label>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', value: '' })}>
                        <Plus className="mr-2 h-4 w-4" /> Add Spec
                    </Button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                        <Input placeholder="Label" {...register(`specs.${index}.label` as const)} />
                        <Input placeholder="Value" {...register(`specs.${index}.value` as const)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input {...register('tags')} placeholder="tag1, tag2, tag3" />
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
            </Button>
        </form>
    );
}
