import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: ReactNode;
  className?: string;
}

export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            
            {change && (
              <div className="flex items-center mt-2">
                {change.type === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    change.type === 'increase' ? 'text-success-600' : 'text-danger-600'
                  )}
                >
                  {Math.abs(change.value)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">{change.period}</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}