import { type LabelHTMLAttributes, forwardRef } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={[
          'text-sm font-medium text-foreground',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
