"use client";
import React from 'react';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewCategoryPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">New Category</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryForm />
                </CardContent>
            </Card>
        </div>
    );
}
