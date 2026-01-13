import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Optional: Helper to mimic "Slow Network" for realistic demo loading states
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}