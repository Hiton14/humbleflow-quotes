"use client";
import React, { useEffect, useState } from 'react';
import { ProductForm } from '@/components/products/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get('/categories'),
                    api.get(`/products/${params.id}`)
                ]);
                setCategories(catRes.data);
                setProduct(prodRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm initialData={product} categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
