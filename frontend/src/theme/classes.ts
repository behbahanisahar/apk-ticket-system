export const TEXT = {
  body: 'text-slate-900',
  heading: 'text-slate-900',
  muted: 'text-slate-600',
  subtle: 'text-slate-500',
  label: 'text-slate-700',
  placeholder: 'text-slate-400',
  mutedLight: 'text-slate-300',
  hoverHeading: 'hover:text-slate-900',
} as const;

export const BORDER = {
  default: 'border-slate-200/80',
  light: 'border-slate-200',
  medium: 'border-slate-300',
  dashed: 'border-slate-200',
  divider: 'border-slate-100',
  hover: 'hover:border-slate-300',
} as const;

export const RING = {
  default: 'ring-slate-200/60',
  light: 'ring-slate-200/40',
} as const;

export const BG = {
  auth: 'bg-slate-50',
  surface: 'bg-white',
  page: 'bg-gradient-to-b from-slate-50 to-slate-100/80',
  muted: 'bg-slate-50/80',
  subtle: 'bg-slate-100/80',
  pill: 'bg-slate-100/80',
  empty: 'bg-slate-100/50',
  skeleton: 'bg-slate-200/60',
  hover: 'hover:bg-slate-50/50',
  rowHover: 'hover:bg-slate-50/50',
  hoverBg: 'bg-slate-50',
  hoverSurface: 'hover:bg-slate-50',
  tabActive: 'bg-slate-100 text-slate-900',
  tabInactive: 'text-slate-600 hover:text-slate-900',
  header: 'bg-white/95',
  avatar: 'bg-slate-300 text-slate-700',
  emptyIcon: 'text-slate-300',
  fallback: 'bg-slate-100 text-slate-600',
  fallbackBadge: 'bg-slate-100',
} as const;

export const FEEDBACK = {
  error: 'text-red-600',
} as const;

export const CARD = {
  base: `rounded-2xl border ${BORDER.default} ${BG.surface} shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/40`,
  table: `rounded-2xl border ${BORDER.default} ${BG.surface} shadow`,
  empty: `rounded-2xl border-2 border-dashed ${BORDER.dashed} py-16`,
} as const;
