import { useEffect, useState } from 'react';
import { calculateTimeLeft } from '../../lib/utils';

interface CountdownTimerProps {
  endDate: string | Date;
  onExpire?: () => void;
  className?: string;
}

export function CountdownTimer({ endDate, onExpire, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isExpired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.isExpired) {
    return <span className={className}>Expired</span>;
  }

  const formatTime = (value: number, unit: string) => {
    if (value === 0) return null;
    return `${value}${unit}`;
  };

  const parts = [
    formatTime(timeLeft.days, 'd'),
    formatTime(timeLeft.hours, 'h'),
    formatTime(timeLeft.minutes, 'm'),
    formatTime(timeLeft.seconds, 's'),
  ].filter(Boolean);

  return (
    <span className={className}>
      {parts.length > 0 ? parts.join(' ') : '0s'}
    </span>
  );
}