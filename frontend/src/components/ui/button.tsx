type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  className?: string;
};

export function Button({ children, type = 'button', variant = 'primary', onClick, className = '' }: ButtonProps) {
  const styles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
