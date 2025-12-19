import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  // Use relative path for production compatibility
  return `${path.startsWith('/') ? '' : '/'}${path}`;
}
