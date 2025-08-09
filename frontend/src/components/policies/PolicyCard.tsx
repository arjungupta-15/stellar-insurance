import { Shield, Users, Clock, DollarSign } from 'lucide-react';
import { Policy } from '../../types/contract';
import { formatCurrency, formatBasisPoints } from '../../lib/utils';
import { StatusBadge } from '../ui/StatusBadge';

interface PolicyCardProps {
  policy: Policy;
  onSubscribe?: (policyId: string) => void;
  isSubscribed?: boolean;
  showSubscribeButton?: boolean;
}

export function PolicyCard({ 
  policy, 
  onSubscribe, 
  isSubscribed = false,
  showSubscribeButton = true 
}: PolicyCardProps) {
  const handleSubscribe = () => {
    if (onSubscribe && !isSubscribed) {
      onSubscribe(policy.id);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
              <StatusBadge status={policy.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{policy.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Weekly Premium</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(policy.params.premium_amount)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Max Coverage</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(policy.params.max_claim_amount)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Claim Cooldown</p>
              <p className="text-sm font-medium text-gray-900">
                {policy.params.claim_cooldown_days} days
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Interest Rate</p>
              <p className="text-sm font-medium text-gray-900">
                {formatBasisPoints(policy.params.interest_rate)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Lock-in Period:</span>
            <span>{policy.params.investor_lock_in_days} days</span>
          </div>
          <div className="flex justify-between">
            <span>DAO Approval Required:</span>
            <span>{policy.params.requires_dao_approval ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span>Credit Penalty:</span>
            <span>{policy.params.credit_slash_on_reject} points</span>
          </div>
        </div>
      </div>

      {showSubscribeButton && (
        <div className="card-footer">
          {isSubscribed ? (
            <div className="flex items-center justify-center py-2">
              <span className="text-sm text-success-600 font-medium">✓ Subscribed</span>
            </div>
          ) : policy.status === 'Active' ? (
            <button
              onClick={handleSubscribe}
              className="btn btn-primary w-full"
            >
              Subscribe to Policy
            </button>
          ) : (
            <button
              disabled
              className="btn btn-secondary w-full opacity-50 cursor-not-allowed"
            >
              Policy Not Available
            </button>
          )}
        </div>
      )}
    </div>
  );
}