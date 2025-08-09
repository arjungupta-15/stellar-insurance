import { 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Plus,
  FileText
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { 
  useWalletConnection, 
  useUser, 
  useUserSubscriptions,
  useUserClaims,
  useSafetyPool,
  useFinancialSummary,
  useClaimStatistics
} from '../hooks/useContract';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatCurrency } from '../lib/utils';

export function Dashboard() {
  const { data: wallet } = useWalletConnection();
  const { data: user } = useUser(wallet?.address);
  const { data: subscriptions } = useUserSubscriptions(wallet?.address);
  const { data: claims } = useUserClaims(wallet?.address);
  const { data: safetyPool } = useSafetyPool();
  const { data: financialSummary } = useFinancialSummary();
  const { data: claimStats } = useClaimStatistics();

  if (!wallet?.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VillageInsure</h1>
          <p className="text-gray-600 mb-6">Connect your wallet to access your insurance dashboard</p>
        </div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions?.data?.filter(s => s.status === 'Active') || [];
  const pendingClaims = claims?.data?.filter(c => c.status === 'Submitted' || c.status === 'UnderReview') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.data?.name || 'User'}! Here's your insurance overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Subscriptions"
            value={activeSubscriptions.length}
            icon={<Shield className="h-6 w-6 text-primary-600" />}
            change={{
              value: 12,
              type: 'increase',
              period: 'vs last month'
            }}
          />
          
          <StatsCard
            title="Total Premiums Paid"
            value={formatCurrency(
              activeSubscriptions.reduce((sum, sub) => 
                sum + parseFloat(sub.total_premiums_paid), 0
              ).toString()
            )}
            icon={<DollarSign className="h-6 w-6 text-success-600" />}
            change={{
              value: 8,
              type: 'increase',
              period: 'this month'
            }}
          />
          
          <StatsCard
            title="Pending Claims"
            value={pendingClaims.length}
            icon={<AlertTriangle className="h-6 w-6 text-warning-600" />}
          />
          
          <StatsCard
            title="Credit Score"
            value={user?.data?.credit_score || 0}
            icon={<TrendingUp className="h-6 w-6 text-primary-600" />}
            change={{
              value: 5,
              type: 'increase',
              period: 'this quarter'
            }}
          />
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Safety Pool</h3>
            </div>
            <div className="card-body">
              {safetyPool?.data ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Balance</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(safetyPool.data.total_balance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Premium Contributions</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(safetyPool.data.premium_contributions)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Claims Paid</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(safetyPool.data.claim_payouts)}
                    </span>
                  </div>
                </div>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Platform Stats</h3>
            </div>
            <div className="card-body">
              {claimStats?.data ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Claims</span>
                    <span className="text-sm font-medium">{claimStats.data.total_claims}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="text-sm font-medium">{claimStats.data.approval_rate_percent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Amount</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(claimStats.data.total_pending_amount)}
                    </span>
                  </div>
                </div>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <a
                  href="/policies"
                  className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Plus className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">Browse Policies</span>
                </a>
                
                <a
                  href="/claims"
                  className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors"
                >
                  <FileText className="h-5 w-5 text-warning-600" />
                  <span className="text-sm font-medium text-warning-700">Submit Claim</span>
                </a>
                
                <a
                  href="/dao"
                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">DAO Governance</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          
          {/* User Profile Summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Profile Summary</h3>
            </div>
            <div className="card-body">
              {user?.data ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium">
                      {new Date(user.data.join_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reputation Score</span>
                    <span className="text-sm font-medium">{user.data.reputation_score}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">DAO Member</span>
                    <span className={`text-sm font-medium ${
                      user.data.is_dao_member ? 'text-success-600' : 'text-gray-600'
                    }`}>
                      {user.data.is_dao_member ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href="/profile"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Full Profile →
                    </a>
                  </div>
                </div>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}