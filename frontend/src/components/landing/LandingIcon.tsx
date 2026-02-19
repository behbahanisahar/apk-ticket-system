import { Headphones } from 'lucide-react';
import { COLORS, hexToRgba } from '../../theme/colors';

export function LandingIcon() {
  return (
    <div className="order-1 flex shrink-0 justify-center md:order-2">
      <div className="relative h-40 w-40 shrink-0 sm:h-48 sm:w-48 md:h-56 md:w-56">
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{ boxShadow: `0 20px 60px -15px ${hexToRgba(COLORS.primary, 0.35)}` }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-full text-white"
            style={{ background: `linear-gradient(145deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)` }}
          >
            <Headphones className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
