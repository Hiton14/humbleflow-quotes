import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
    if (!path) return '/placeholder.svg';
    if (path.startsWith('http')) return path;
    return `${path.startsWith('/') ? '' : '/'}${path}`;
}
