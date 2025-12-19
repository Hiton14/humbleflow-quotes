"use client";
import React, { useEffect, useState } from 'react';
import { ProductForm } from '@/components/products/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

export default function NewProductPage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        api.get('/categories').then(res => setCategories(res.data));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">New Product</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
