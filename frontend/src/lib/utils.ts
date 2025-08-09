import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number, currency = "XLM"): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${numAmount.toLocaleString()} ${currency}`;
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatPercentage(value: number): string {
  return `${(value / 100).toFixed(2)}%`;
}

export function formatBasisPoints(value: number): string {
  return `${(value / 100).toFixed(2)}%`;
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function calculateTimeLeft(endDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // User Status
    'Pending': 'warning',
    'Active': 'success',
    'Banned': 'danger',
    
    // Policy Status
    'Archived': 'gray',
    'Deleted': 'danger',
    
    // Subscription Status
    'GracePeriod': 'warning',
    'Suspended': 'danger',
    'Cancelled': 'gray',
    
    // Claim Status
    'Submitted': 'primary',
    'UnderReview': 'warning',
    'Approved': 'success',
    'Rejected': 'danger',
    'Paid': 'success',
    'Disputed': 'warning',
    
    // Proposal Status
    'Passed': 'success',
    'Failed': 'danger',
    'Expired': 'gray',
    'Executing': 'warning',
    'Invalid': 'danger',
  };

  return statusColors[status] || 'gray';
}

export function calculateVotingProgress(votesFor: number, votesAgainst: number): {
  forPercentage: number;
  againstPercentage: number;
  total: number;
} {
  const total = votesFor + votesAgainst;
  if (total === 0) {
    return { forPercentage: 0, againstPercentage: 0, total: 0 };
  }

  return {
    forPercentage: (votesFor / total) * 100,
    againstPercentage: (votesAgainst / total) * 100,
    total,
  };
}

export function generateMockHash(): string {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}