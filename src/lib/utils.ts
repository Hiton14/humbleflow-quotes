import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) return `${import.meta.env.BASE_URL}placeholder.svg`.replace(/\/+/g, '/');
  if (path.startsWith('http')) return path;

  // Make sure the path doesn't have a leading slash so we don't get //
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Combine BASE_URL and path, ensuring exactly one slash between them
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${cleanPath}`;
}
