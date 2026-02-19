import { COLORS, hexToRgba } from '../../theme/colors';

export function LandingBackground() {
  return (
    <div
      className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-50"
      style={{
        background: `radial-gradient(circle, ${hexToRgba(COLORS.primary, 0.08)} 0%, transparent 70%)`,
      }}
    />
  );
}
