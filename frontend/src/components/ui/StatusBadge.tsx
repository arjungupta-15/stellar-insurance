import { cn } from '../../lib/utils';
import { getStatusColor } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = getStatusColor(status);
  
  const colorClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    gray: 'badge-gray',
  };

  return (
    <span className={cn(colorClasses[color as keyof typeof colorClasses] || 'badge-gray', className)}>
      {status}
    </span>
  );
}