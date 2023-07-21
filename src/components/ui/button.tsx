import { cn } from '@/lib/utils';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md border border-foreground ring-1 ring-foreground text-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accents-3 disabled:cursor-not-allowed disabled:text-accents-3 disabled:border-accents-3 disabled:ring-accents-3',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'px-4 py-3',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded-md px-8',
        sm: 'h-9 rounded-md px-3',
      },
      variant: {
        default: 'bg-background text-foreground hover:ring-2',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost:
          'bg-background ring-0 border-0 text-foreground hover:bg-background/90',
        link: 'text-primary underline-offset-4 hover:underline',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      prefixIcon,
      size,
      suffixIcon,
      variant,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      >
        {prefixIcon && <span className='mr-2'>{prefixIcon}</span>}
        <Slottable>{props.children}</Slottable>
        {suffixIcon && <span className='ml-2'>{suffixIcon}</span>}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
