import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toPersianDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

export function getImageUrl(img: string | null | undefined): string | null {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/(api|auth)\/?$/, '');
  return base ? base + (img.startsWith('/') ? img : '/' + img) : img;
}
