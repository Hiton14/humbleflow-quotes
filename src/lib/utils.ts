import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  // If it's a relative path starting with /uploads, prepend the backend URL
  const backendUrl = 'http://localhost:3000';
  return `${backendUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
