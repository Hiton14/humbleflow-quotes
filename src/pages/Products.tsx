import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product } from '@/types/database';
import { CATEGORIES } from '@/lib/data';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

    // Sync state with URL param
    useEffect(() => {
        setSelectedCategory(categoryParam);
    }, [categoryParam]);

    const handleCategoryChange = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
    };

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products', selectedCategory],
        queryFn: async () => {
            // If API supports filtering, use it. Otherwise fetch all and filter client-side.
            // Based on api.ts from previous turns, it supports category_id
            const params = selectedCategory ? { category_id: selectedCategory } : {};
            const data = await api.products.list(params);
            return (data || []).map((p: any) => ({
                ...p,
                specs: p.specs || [],
                images: p.images || [],
                tags: p.tags || []
            })) as Product[];
        },
    });

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Our Products</h1>
                    <p className="text-muted-foreground mb-6">
                        Explore our comprehensive range of industrial and technical solutions.
                    </p>

                    <CategoryFilter
                        categories={CATEGORIES}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-lg">
                        <p className="text-xl text-muted-foreground">No products found for this category.</p>
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className="mt-4 text-primary hover:underline"
                        >
                            View all products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
