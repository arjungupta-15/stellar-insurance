import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { PolicyCard } from '../components/policies/PolicyCard';
import { CreatePolicyModal } from '../components/policies/CreatePolicyModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  usePolicies, 
  useUserSubscriptions, 
  useSubscribeToPolicy,
  useWalletConnection,
  useUser
} from '../hooks/useContract';
import { PolicyStatus } from '../types/contract';

export function Policies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'All'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: wallet } = useWalletConnection();
  const { data: user } = useUser(wallet?.address);
  const { data: policies, isLoading } = usePolicies();
  const { data: subscriptions } = useUserSubscriptions(wallet?.address);
  const subscribeToPolicy = useSubscribeToPolicy();

  const handleSubscribe = async (policyId: string) => {
    try {
      await subscribeToPolicy.mutateAsync(policyId);
    } catch (error) {
      console.error('Failed to subscribe to policy:', error);
    }
  };

  // Filter policies
  const filteredPolicies = policies?.data?.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Get user's subscribed policy IDs
  const subscribedPolicyIds = new Set(
    subscriptions?.data?.map(sub => sub.policy_id) || []
  );

  const canCreatePolicy = user?.data?.is_dao_member;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Policies</h1>
            <p className="text-gray-600 mt-2">
              Browse and subscribe to available insurance policies
            </p>
          </div>
          
          {canCreatePolicy && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Policy</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PolicyStatus | 'All')}
                className="input pl-10"
              >
                <option value="All">All Statuses</option>
                <option value={PolicyStatus.Active}>Active</option>
                <option value={PolicyStatus.Pending}>Pending</option>
                <option value={PolicyStatus.Archived}>Archived</option>
              </select>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <span>{filteredPolicies.length} policies found</span>
            </div>
          </div>
        </div>

        {/* Policies Grid */}
        {filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onSubscribe={handleSubscribe}
                isSubscribed={subscribedPolicyIds.has(policy.id)}
                showSubscribeButton={wallet?.isConnected}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'No insurance policies are currently available'
              }
            </p>
          </div>
        )}

        {/* Create Policy Modal */}
        <CreatePolicyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  );
}