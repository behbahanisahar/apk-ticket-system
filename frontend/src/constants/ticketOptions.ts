import { TicketStatus, TicketPriority } from './enums';

export const STATUS_OPTIONS = [
  { value: TicketStatus.Open, label: 'باز' },
  { value: TicketStatus.InProgress, label: 'در حال بررسی' },
  { value: TicketStatus.Closed, label: 'بسته' },
];

export const STATUS_OPTIONS_WITH_ALL = [
  { value: 'all', label: 'همه' },
  ...STATUS_OPTIONS,
];

export const PRIORITY_OPTIONS = [
  { value: TicketPriority.Low, label: 'کم' },
  { value: TicketPriority.Medium, label: 'متوسط' },
  { value: TicketPriority.High, label: 'زیاد' },
];

export const PRIORITY_OPTIONS_WITH_ALL = [
  { value: 'all', label: 'همه' },
  ...PRIORITY_OPTIONS,
];

export const SORT_OPTIONS = [
  { value: '-created_at', label: 'جدیدترین اول' },
  { value: 'created_at', label: 'قدیمی‌ترین اول' },
  { value: '-updated_at', label: 'آخرین بروزرسانی' },
];
