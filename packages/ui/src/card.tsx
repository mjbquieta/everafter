import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-lg border border-border bg-surface shadow-sm',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={['flex flex-col space-y-1.5 p-6', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={['text-2xl font-semibold text-foreground', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={['text-sm text-muted', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={['p-6 pt-0', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={['flex items-center p-6 pt-0', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
