import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, containerClassName, prefixIcon, suffixIcon, type, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex max-w-full items-center gap-x-4 rounded-md bg-background px-4 py-2 text-lg ring-1 ring-foreground transition-shadow focus-within:ring-2 focus-within:ring-foreground',
          {
            'text-error ring-error focus-within:ring-error':
              props['aria-invalid'] === true,
          },
          containerClassName,
        )}
      >
        <input
          className={cn(
            'flex w-full border-0 bg-background p-0 placeholder:text-accents-3 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          type={type}
          {...props}
        />
        {suffixIcon && <span className='order-last'>{suffixIcon}</span>}
        {prefixIcon && <span className='order-first'>{prefixIcon}</span>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
