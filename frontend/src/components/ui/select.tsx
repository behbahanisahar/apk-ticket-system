import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: { target: { value: string } }) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  size?: 'default' | 'small';
  disabled?: boolean;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, value, onValueChange, onChange, label, placeholder = 'انتخاب کنید', className, size = 'default', disabled }, ref) => {
    const handleChange = (v: string) => {
      onValueChange?.(v);
      onChange?.({ target: { value: v } });
    };
    return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={handleChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-right transition-all duration-200',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            size === 'small' ? 'h-9' : 'h-10',
            className
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="shrink-0 opacity-50 ms-2">
            <ChevronDown className="h-4 w-4 rtl:rotate-180" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            dir="rtl"
            className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-soft-lg"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-right text-sm outline-none focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
  }
);
Select.displayName = 'Select';

export { Select };
