import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Subscription, Policy } from '../../types/contract';
import { formatCurrency, formatDate, formatRelativeTime } from '../../lib/utils';
import { StatusBadge } from '../ui/StatusBadge';

interface SubscriptionCardProps {
  subscription: Subscription;
  policy?: Policy;
  onPayPremium?: (subscriptionId: string) => void;
  onCancel?: (subscriptionId: string) => void;
  showActions?: boolean;
}

export function SubscriptionCard({ 
  subscription, 
  policy, 
  onPayPremium, 
  onCancel,
  showActions = true 
}: SubscriptionCardProps) {
  const isPaymentDue = subscription.weeks_due > subscription.weeks_paid;
  const isGracePeriod = subscription.status === 'GracePeriod';
  const isSuspended = subscription.status === 'Suspended';

  const handlePayPremium = () => {
    if (onPayPremium) {
      onPayPremium(subscription.id);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(subscription.id);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {policy?.title || `Policy #${subscription.policy_id}`}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge status={subscription.status} />
              {isPaymentDue && (
                <span className="badge badge-warning">Payment Due</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(subscription.start_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Total Paid</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(subscription.total_premiums_paid)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Weeks Paid</p>
              <p className="text-sm font-medium text-gray-900">
                {subscription.weeks_paid} / {subscription.weeks_due}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Last Payment</p>
              <p className="text-sm font-medium text-gray-900">
                {subscription.last_payment_date 
                  ? formatRelativeTime(subscription.last_payment_date)
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {isPaymentDue && (
          <div className={`p-3 rounded-lg mb-4 ${
            isGracePeriod ? 'bg-warning-50 border border-warning-200' :
            isSuspended ? 'bg-danger-50 border border-danger-200' :
            'bg-primary-50 border border-primary-200'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-4 w-4 ${
                isGracePeriod ? 'text-warning-600' :
                isSuspended ? 'text-danger-600' :
                'text-primary-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  isGracePeriod ? 'text-warning-800' :
                  isSuspended ? 'text-danger-800' :
                  'text-primary-800'
                }`}>
                  {isSuspended ? 'Subscription Suspended' :
                   isGracePeriod ? 'Grace Period Active' :
                   'Payment Due'}
                </p>
                <p className={`text-xs ${
                  isGracePeriod ? 'text-warning-600' :
                  isSuspended ? 'text-danger-600' :
                  'text-primary-600'
                }`}>
                  {policy && `Weekly premium: ${formatCurrency(policy.params.premium_amount)}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Policy Details */}
        {policy && (
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Weekly Premium:</span>
              <span>{formatCurrency(policy.params.premium_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Coverage:</span>
              <span>{formatCurrency(policy.params.max_claim_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Claim Cooldown:</span>
              <span>{policy.params.claim_cooldown_days} days</span>
            </div>
          </div>
        )}
      </div>

      {showActions && (
        <div className="card-footer">
          <div className="flex space-x-2">
            {isPaymentDue && subscription.status !== 'Cancelled' && (
              <button
                onClick={handlePayPremium}
                className="btn btn-primary flex-1"
              >
                Pay Premium
              </button>
            )}
            
            {subscription.status === 'Active' && (
              <button
                onClick={handleCancel}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            )}
            
            {subscription.status === 'Suspended' && (
              <button
                onClick={handlePayPremium}
                className="btn btn-success flex-1"
              >
                Reactivate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}