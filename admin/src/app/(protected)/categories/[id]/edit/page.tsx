"use client";
import React, { useEffect, useState } from 'react';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function EditCategoryPage() {
    const params = useParams();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategory() {
            try {
                // We don't have a direct GET /categories/:id endpoint exposed publically in my previous check?
                // Wait, server/routes/categories.ts only had GET / (all). 
                // I need to enable GET /:id or filter by ID on client? 
                // Backend changes earlier only added POST/PUT/DELETE.
                // Product routes had GET /:id. Categories route did NOT.
                // Checking categories.ts content earlier... 
                // "router.get('/', ...)"
                // I need to add GET /:id to server/routes/categories.ts ASAP!
                const res = await api.get('/categories');
                const found = res.data.find((c: any) => c.id === params.id);
                if (found) setCategory(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!category) return <div>Category not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Category</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryForm initialData={category} />
                </CardContent>
            </Card>
        </div>
    );
}
