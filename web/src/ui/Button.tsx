import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-orange-600 text-white active:bg-orange-700 disabled:bg-orange-300',
  secondary: 'bg-white text-orange-700 border border-orange-300 active:bg-orange-50',
  ghost: 'bg-transparent text-stone-600 active:bg-stone-100',
};

export const Button: FC<Props> = ({ variant = 'primary', className = '', children, ...rest }) => (
  <button
    className={`rounded-xl px-5 py-3 text-base font-semibold transition-colors disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
