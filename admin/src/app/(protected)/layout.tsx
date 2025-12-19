"use client";
import { Sidebar } from '@/components/layout/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !token) {
            router.push('/admin/login');
        }
    }, [token, isLoading, router]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!token) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="pl-64">
                <div className="container py-8">{children}</div>
            </main>
        </div>
    );
}
