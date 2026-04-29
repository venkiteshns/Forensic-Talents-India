import React, { forwardRef } from 'react';
import { cn } from "../../utils/cn";

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light shadow-md",
    secondary: "bg-white text-primary border border-primary hover:bg-slate-50",
    accent: "bg-accent text-primary font-bold hover:bg-yellow-500 shadow-md",
    ghost: "text-primary hover:bg-primary/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
