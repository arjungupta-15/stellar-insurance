import { useState } from 'react';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { ClaimCard } from '../components/claims/ClaimCard';
import { SubmitClaimModal } from '../components/claims/SubmitClaimModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  useClaims,
  useUserClaims,
  useUserSubscriptions,
  useVoteClaim,
  useApproveClaim,
  useRejectClaim,
  useWalletConnection,
  useUser,
  usePolicies
} from '../hooks/useContract';
import { ClaimStatus } from '../types/contract';

export function Claims() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: wallet } = useWalletConnection();
  const { data: user } = useUser(wallet?.address);
  const { data: allClaims, isLoading: isLoadingAllClaims } = useClaims();
  const { data: userClaims, isLoading: isLoadingUserClaims } = useUserClaims(wallet?.address);
  const { data: subscriptions } = useUserSubscriptions(wallet?.address);
  const { data: policies } = usePolicies();
  
  const voteClaim = useVoteClaim();
  const approveClaim = useApproveClaim();
  const rejectClaim = useRejectClaim();

  const handleVote = async (claimId: string, approve: boolean) => {
    try {
      await voteClaim.mutateAsync({ claimId, approve });
    } catch (error) {
      console.error('Failed to vote on claim:', error);
    }
  };

  const handleApprove = async (claimId: string) => {
    try {
      await approveClaim.mutateAsync(claimId);
    } catch (error) {
      console.error('Failed to approve claim:', error);
    }
  };

  const handleReject = async (claimId: string, reason: string) => {
    try {
      await rejectClaim.mutateAsync({ claimId, reason });
    } catch (error) {
      console.error('Failed to reject claim:', error);
    }
  };

  // Get claims based on view mode
  const claims = viewMode === 'my' ? userClaims?.data : allClaims?.data;
  const isLoading = viewMode === 'my' ? isLoadingUserClaims : isLoadingAllClaims;

  // Filter claims
  const filteredClaims = claims?.filter(claim => {
    const matchesSearch = claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Get active subscription for submit modal
  const activeSubscription = subscriptions?.data?.find(sub => sub.status === 'Active');
  const activePolicy = policies?.data?.find(policy => policy.id === activeSubscription?.policy_id);

  const canVote = user?.data?.is_dao_member;
  const canAdminAction = user?.data?.is_dao_member;

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
            <h1 className="text-3xl font-bold text-gray-900">Insurance Claims</h1>
            <p className="text-gray-600 mt-2">
              {viewMode === 'my' ? 'Your submitted claims' : 'All platform claims'}
            </p>
          </div>
          
          {activeSubscription && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Submit Claim</span>
            </button>
          )}
        </div>

        {/* View Toggle and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Claims
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'my'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Claims
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ClaimStatus | 'All')}
                  className="input pl-10"
                >
                  <option value="All">All Statuses</option>
                  <option value={ClaimStatus.Submitted}>Submitted</option>
                  <option value={ClaimStatus.UnderReview}>Under Review</option>
                  <option value={ClaimStatus.Approved}>Approved</option>
                  <option value={ClaimStatus.Rejected}>Rejected</option>
                  <option value={ClaimStatus.Paid}>Paid</option>
                  <option value={ClaimStatus.Disputed}>Disputed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            {filteredClaims.length} claims found
          </div>
        </div>

        {/* Claims Grid */}
        {filteredClaims.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                onVote={handleVote}
                onApprove={handleApprove}
                onReject={handleReject}
                showVotingActions={canVote && viewMode === 'all'}
                showAdminActions={canAdminAction && viewMode === 'all'}
                isUserClaim={viewMode === 'my'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
            <p className="text-gray-600 mb-4">
              {viewMode === 'my' 
                ? "You haven't submitted any claims yet"
                : searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search or filter criteria'
                : 'No claims have been submitted to the platform'
              }
            </p>
            
            {viewMode === 'my' && activeSubscription && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn btn-primary"
              >
                Submit Your First Claim
              </button>
            )}
          </div>
        )}

        {/* Submit Claim Modal */}
        {activeSubscription && activePolicy && (
          <SubmitClaimModal
            isOpen={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
            subscriptionId={activeSubscription.id}
            maxClaimAmount={activePolicy.params.max_claim_amount}
          />
        )}
      </div>
    </div>
  );
}