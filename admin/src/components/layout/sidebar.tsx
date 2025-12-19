"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { href: '/admin/products', label: 'Products', icon: ShoppingBag },
        { href: '/admin/categories', label: 'Categories', icon: LayoutDashboard },
        { href: '/admin/profile', label: 'Profile', icon: Package },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
            <div className="flex h-16 items-center border-b px-6">
                <Package className="mr-2 h-6 w-6" />
                <span className="font-bold">Admin Panel</span>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
                                isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </div>
            <div className="absolute bottom-4 left-0 w-full px-4">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
