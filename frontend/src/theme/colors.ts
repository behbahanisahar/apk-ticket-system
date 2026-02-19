export const COLORS = {
  primary: '#ED1E23',
  primaryLight: '#f24a4e',
  primaryDark: '#c4181c',
  secondary: '#54595F',
} as const;

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
