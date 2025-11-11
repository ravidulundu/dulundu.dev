import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantClasses = {
  primary: 'bg-primary/15 text-primary',
  accent: 'bg-accent/15 text-accent-foreground',
  secondary: 'bg-secondary/30 text-secondary-foreground',
  neutral: 'bg-muted text-foreground',
};

const sizeClasses = {
  md: 'w-12 h-12 rounded-2xl',
  lg: 'w-14 h-14 rounded-3xl',
};

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  className?: string;
  strokeWidth?: number;
}

export function IconBadge({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className,
  strokeWidth = 1.8,
}: IconBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center shadow-[var(--shadow-sm)] text-foreground',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <Icon className="w-5 h-5" strokeWidth={strokeWidth} />
    </div>
  );
}
