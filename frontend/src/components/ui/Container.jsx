import React, { forwardRef } from 'react';
import { cn } from "../../utils/cn";

export const Container = forwardRef(({ children, className, id, ...props }, ref) => {
  return (
    <div ref={ref} id={id} className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';
