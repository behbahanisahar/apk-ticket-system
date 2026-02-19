import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  multiline?: boolean;
  rows?: number;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, type, label, id, multiline, rows = 3, ...props }, ref) => {
    const inputId = id ?? label?.replace(/\s/g, '-');
    const baseClass = cn(
      'flex w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-right transition-all duration-200',
      'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
      multiline ? 'min-h-[80px] resize-y' : 'h-10',
      className
    );
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            id={inputId}
            rows={rows}
            className={baseClass}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            dir="rtl"
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            id={inputId}
            className={baseClass}
            ref={ref as React.Ref<HTMLInputElement>}
            dir="rtl"
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-right',
            'placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          dir="rtl"
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
