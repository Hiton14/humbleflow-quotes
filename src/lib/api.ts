import { PRODUCTS, CATEGORIES, Product, Category } from './data';

export const api = {
    products: {
        list: async (params?: { slug?: string, category_id?: string, exclude_id?: string, limit?: number }) => {
            let filtered = [...PRODUCTS];

            if (params?.slug) {
                filtered = filtered.filter(p => p.slug === params.slug);
            }
            if (params?.category_id) {
                filtered = filtered.filter(p => p.category_id === params.category_id);
            }
            if (params?.exclude_id) {
                filtered = filtered.filter(p => p.id !== params.exclude_id);
            }

            // Map category data into the product to match expected frontend structure (populate)
            const populated = filtered.map(p => {
                const category = CATEGORIES.find(c => c.id === p.category_id);
                return { ...p, category };
            });

            if (params?.limit) {
                return populated.slice(0, params.limit);
            }

            return populated;
        },
        get: async (id: string) => {
            const product = PRODUCTS.find(p => p.id === id || p.slug === id);
            if (!product) throw new Error('Product not found');

            const category = CATEGORIES.find(c => c.id === product.category_id);
            return { ...product, category };
        }
    },
    categories: {
        list: async () => {
            return CATEGORIES;
        }
    }
};
