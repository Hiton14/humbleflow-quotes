const API_URL = '/api';

export const api = {
    products: {
        list: async (params?: { slug?: string, category_id?: string, exclude_id?: string, limit?: number }) => {
            const searchParams = new URLSearchParams();
            if (params?.slug) searchParams.append('slug', params.slug);
            if (params?.category_id) searchParams.append('category_id', params.category_id);
            if (params?.exclude_id) searchParams.append('exclude_id', params.exclude_id);
            if (params?.limit) searchParams.append('limit', params.limit.toString());

            const response = await fetch(`${API_URL}/products?${searchParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return response.json();
        },
        get: async (id: string) => {
            const response = await fetch(`${API_URL}/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            return response.json();
        }
    },
    categories: {
        list: async () => {
            const response = await fetch(`${API_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return response.json();
        }
    }
};
