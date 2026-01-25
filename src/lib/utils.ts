import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;

  // Simply ensure it starts with a leading slash for the root domain
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
}
