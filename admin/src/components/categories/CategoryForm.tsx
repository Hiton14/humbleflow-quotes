"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const categorySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
});

interface CategoryFormProps {
    initialData?: any;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || {
            title: '',
            slug: '',
            description: '',
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('slug', data.slug);
            formData.append('description', data.description || '');
            if (file) {
                formData.append('image', file);
            }

            if (initialData) {
                await api.put(`/categories/${initialData.id}`, formData);
                toast.success('Category updated');
            } else {
                await api.post('/categories', formData);
                toast.success('Category created');
            }
            router.push('/admin/categories');
            router.refresh(); // Refresh server components if any (though we are mostly client side for list currently)
        } catch (err) {
            toast.error('Something went wrong');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
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
                <label className="text-sm font-medium">Description</label>
                <Input {...register('description')} />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <ImageUpload
                    value={file || initialData?.image_url}
                    onChange={setFile}
                    onRemove={() => setFile(null)}
                />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
            </Button>
        </form>
    );
}
