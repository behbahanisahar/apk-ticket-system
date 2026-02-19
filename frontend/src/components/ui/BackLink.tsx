import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TEXT, BORDER, BG } from '../../theme';

interface BackLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal';
}

const variants = {
  default: `inline-flex items-center gap-2 rounded-xl border ${BORDER.default} ${BG.surface} px-4 py-2.5 ${TEXT.muted} no-underline shadow-sm transition-all ${BORDER.hover} ${BG.hoverSurface} ${TEXT.hoverHeading} hover:shadow`,
  minimal: `inline-flex items-center gap-1 ${TEXT.muted} no-underline hover:text-primary`,
};

export function BackLink({ to, children = 'بازگشت', className = '', variant = 'default' }: BackLinkProps) {
  return (
    <Link to={to} className={`${variants[variant]} ${className}`.trim()}>
      <ArrowLeft className="h-4 w-4" />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}
