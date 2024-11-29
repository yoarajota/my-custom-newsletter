import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string): string {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getInitials(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}