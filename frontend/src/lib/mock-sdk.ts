// Mock SDK for development - simulates your Soroban contract interactions
import { 
  User, Policy, Subscription, Claim, Proposal, SafetyPool, 
  UserStatus, PolicyStatus, SubscriptionStatus, ClaimStatus, ProposalStatus,
  ClaimType, ProposalType, ApiResponse, FinancialSummary, ClaimStatistics,
  Payment, PlatformConfig
} from '../types/contract';

// Mock data
const mockUsers: User[] = [
  {
    address: 'GABC123...WXYZ',
    name: 'John Farmer',
    credit_score: 85,
    status: UserStatus.Active,
    join_date: '2024-01-15T00:00:00Z',
    is_dao_member: false,
    reputation_score: 75,
    staked_amount: '1000000000',
    last_vote_timestamp: '2024-12-01T00:00:00Z',
  },
  {
    address: 'GDEF456...STUV',
    name: 'Sarah Council',
    credit_score: 95,
    status: UserStatus.Active,
    join_date: '2023-08-10T00:00:00Z',
    is_dao_member: true,
    reputation_score: 120,
    staked_amount: '5000000000',
    last_vote_timestamp: '2024-12-20T00:00:00Z',
  },
];

const mockPolicies: Policy[] = [
  {
    id: '1',
    title: 'Crop Loss Protection',
    description: 'Comprehensive coverage for crop failures due to weather, pests, or disease',
    params: {
      max_claim_amount: '5000000000', // 5000 XLM
      interest_rate: 500, // 5%
      premium_amount: '50000000', // 50 XLM
      claim_cooldown_days: 30,
      investor_lock_in_days: 90,
      requires_dao_approval: true,
      credit_slash_on_reject: 10,
    },
    status: PolicyStatus.Active,
    created_at: '2024-01-01T00:00:00Z',
    creator: 'GDEF456...STUV',
  },
  {
    id: '2',
    title: 'Livestock Insurance',
    description: 'Protection for cattle, goats, and poultry against disease and accidents',
    params: {
      max_claim_amount: '3000000000', // 3000 XLM
      interest_rate: 600, // 6%
      premium_amount: '30000000', // 30 XLM
      claim_cooldown_days: 14,
      investor_lock_in_days: 60,
      requires_dao_approval: true,
      credit_slash_on_reject: 15,
    },
    status: PolicyStatus.Active,
    created_at: '2024-02-01T00:00:00Z',
    creator: 'GDEF456...STUV',
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    policy_id: '1',
    subscriber: 'GABC123...WXYZ',
    start_date: '2024-11-01T00:00:00Z',
    status: SubscriptionStatus.Active,
    last_payment_date: '2024-12-15T00:00:00Z',
    next_payment_due: '2024-12-22T00:00:00Z',
    weeks_paid: 7,
    weeks_due: 8,
    total_premiums_paid: '350000000',
  },
];

const mockClaims: Claim[] = [
  {
    id: '1',
    subscription_id: '1',
    claimer: 'GABC123...WXYZ',
    amount: '2000000000',
    image_hash: 'QmX1Y2Z3...',
    description: 'Crop damage due to unexpected frost. Lost 80% of wheat harvest.',
    status: ClaimStatus.UnderReview,
    created_at: '2024-12-18T00:00:00Z',
    plan_id: '1',
    user: 'GABC123...WXYZ',
    claim_type: ClaimType.Crop,
    evidence_hash: 'QmX1Y2Z3...',
    submission_date: '2024-12-18T00:00:00Z',
    assessor_notes: '',
  },
];

const mockProposals: Proposal[] = [
  {
    id: '1',
    proposer: 'GDEF456...STUV',
    proposal_type: ProposalType.PlanManagement,
    title: 'New Emergency Medical Coverage Plan',
    description: 'Proposal to create a new insurance plan for emergency medical expenses in rural areas.',
    voting_period_end: '2024-12-25T00:00:00Z',
    votes_for: 3,
    votes_against: 1,
    status: ProposalStatus.Active,
    execution_data: '{}',
    quorum_required: 3,
    created_date: '2024-12-18T00:00:00Z',
  },
];

const mockSafetyPool: SafetyPool = {
  total_balance: '50000000000', // 50,000 XLM
  premium_contributions: '45000000000',
  claim_payouts: '8000000000',
  investment_returns: '3000000000',
  reserve_ratio: 7500, // 75%
  last_audit_date: '2024-12-01T00:00:00Z',
  minimum_reserve: '10000000000',
};

// Mock SDK class
export class MockVillageInsuranceSDK {
  private currentUser: string = 'GABC123...WXYZ';
  private isConnected: boolean = false;

  // Connection methods
  async connect(): Promise<{ address: string; balance: string }> {
    await this.delay(1000);
    this.isConnected = true;
    return {
      address: this.currentUser,
      balance: '10000000000', // 10,000 XLM
    };
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }

  getCurrentUser(): string | null {
    return this.isConnected ? this.currentUser : null;
  }

  // User Management
  async registerUser(name?: string): Promise<ApiResponse<boolean>> {
    await this.delay(1500);
    return { success: true, data: true, message: 'User registered successfully' };
  }

  async getUser(address?: string): Promise<ApiResponse<User>> {
    await this.delay(500);
    const userAddress = address || this.currentUser;
    const user = mockUsers.find(u => u.address === userAddress);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  }

  async updateUserReputation(address: string, change: number): Promise<ApiResponse<boolean>> {
    await this.delay(1000);
    return { success: true, data: true, message: 'Reputation updated' };
  }

  // Policy Management
  async getPolicies(): Promise<ApiResponse<Policy[]>> {
    await this.delay(800);
    return { success: true, data: mockPolicies };
  }

  async getPolicy(policyId: string): Promise<ApiResponse<Policy>> {
    await this.delay(500);
    const policy = mockPolicies.find(p => p.id === policyId);
    
    if (!policy) {
      return { success: false, error: 'Policy not found' };
    }
    
    return { success: true, data: policy };
  }

  async createPolicy(params: {
    title: string;
    description: string;
    maxClaimAmount: string;
    interestRate: number;
    premiumAmount: string;
    claimCooldownDays: number;
    investorLockInDays: number;
    requiresDaoApproval: boolean;
    creditSlashOnReject: number;
  }): Promise<ApiResponse<string>> {
    await this.delay(2000);
    return { success: true, data: '3', message: 'Policy proposal created' };
  }

  // Subscription Management
  async subscribeToPolicy(policyId: string): Promise<ApiResponse<string>> {
    await this.delay(1500);
    return { success: true, data: '2', message: 'Successfully subscribed to policy' };
  }

  async getSubscription(subscriptionId?: string): Promise<ApiResponse<Subscription>> {
    await this.delay(500);
    const subscription = mockSubscriptions.find(s => 
      subscriptionId ? s.id === subscriptionId : s.subscriber === this.currentUser
    );
    
    if (!subscription) {
      return { success: false, error: 'Subscription not found' };
    }
    
    return { success: true, data: subscription };
  }

  async getUserSubscriptions(address?: string): Promise<ApiResponse<Subscription[]>> {
    await this.delay(600);
    const userAddress = address || this.currentUser;
    const subscriptions = mockSubscriptions.filter(s => s.subscriber === userAddress);
    return { success: true, data: subscriptions };
  }

  async payPremium(subscriptionId: string): Promise<ApiResponse<boolean>> {
    await this.delay(2000);
    return { success: true, data: true, message: 'Premium payment successful' };
  }

  async cancelSubscription(subscriptionId: string): Promise<ApiResponse<boolean>> {
    await this.delay(1500);
    return { success: true, data: true, message: 'Subscription cancelled' };
  }

  // Claims Management
  async submitClaim(params: {
    subscriptionId: string;
    amount: string;
    claimType: ClaimType;
    description: string;
    imageFile: File;
  }): Promise<ApiResponse<string>> {
    await this.delay(3000);
    return { success: true, data: '2', message: 'Claim submitted successfully' };
  }

  async getClaims(): Promise<ApiResponse<Claim[]>> {
    await this.delay(700);
    return { success: true, data: mockClaims };
  }

  async getUserClaims(address?: string): Promise<ApiResponse<Claim[]>> {
    await this.delay(600);
    const userAddress = address || this.currentUser;
    const claims = mockClaims.filter(c => c.claimer === userAddress);
    return { success: true, data: claims };
  }

  async voteClaim(claimId: string, approve: boolean): Promise<ApiResponse<boolean>> {
    await this.delay(1500);
    return { success: true, data: true, message: `Vote ${approve ? 'for' : 'against'} claim recorded` };
  }

  async approveClaim(claimId: string): Promise<ApiResponse<boolean>> {
    await this.delay(2000);
    return { success: true, data: true, message: 'Claim approved and payout processed' };
  }

  async rejectClaim(claimId: string, reason: string): Promise<ApiResponse<boolean>> {
    await this.delay(1500);
    return { success: true, data: true, message: 'Claim rejected' };
  }

  // DAO Governance
  async getProposals(): Promise<ApiResponse<Proposal[]>> {
    await this.delay(800);
    return { success: true, data: mockProposals };
  }

  async createProposal(params: {
    type: ProposalType;
    title: string;
    description: string;
    executionData: string;
  }): Promise<ApiResponse<string>> {
    await this.delay(2000);
    return { success: true, data: '2', message: 'Proposal created successfully' };
  }

  async voteProposal(proposalId: string, voteFor: boolean): Promise<ApiResponse<boolean>> {
    await this.delay(1500);
    return { success: true, data: true, message: `Vote ${voteFor ? 'for' : 'against'} proposal recorded` };
  }

  async executeProposal(proposalId: string): Promise<ApiResponse<boolean>> {
    await this.delay(2500);
    return { success: true, data: true, message: 'Proposal executed successfully' };
  }

  // Financial Management
  async getSafetyPoolBalance(): Promise<ApiResponse<string>> {
    await this.delay(400);
    return { success: true, data: mockSafetyPool.total_balance };
  }

  async getSafetyPoolDetails(): Promise<ApiResponse<SafetyPool>> {
    await this.delay(500);
    return { success: true, data: mockSafetyPool };
  }

  async getFinancialSummary(): Promise<ApiResponse<FinancialSummary>> {
    await this.delay(600);
    return {
      success: true,
      data: {
        total_premiums: '45000000000',
        total_claims: '8000000000',
        net_balance: '37000000000',
        reserve_percentage: '7500',
      },
    };
  }

  async getClaimStatistics(): Promise<ApiResponse<ClaimStatistics>> {
    await this.delay(500);
    return {
      success: true,
      data: {
        total_claims: 25,
        total_paid_amount: '8000000000',
        total_pending_amount: '3000000000',
        approval_rate_percent: 78,
      },
    };
  }

  async addExternalFunding(amount: string): Promise<ApiResponse<boolean>> {
    await this.delay(2000);
    return { success: true, data: true, message: 'External funding added successfully' };
  }

  async withdrawReserveFunds(amount: string, purpose: string): Promise<ApiResponse<boolean>> {
    await this.delay(2000);
    return { success: true, data: true, message: 'Reserve funds withdrawn' };
  }

  // Investment Management
  async depositInvestment(amount: string): Promise<ApiResponse<boolean>> {
    await this.delay(2000);
    return { success: true, data: true, message: 'Investment deposited successfully' };
  }

  async withdrawInvestment(amount: string): Promise<ApiResponse<boolean>> {
    await this.delay(2000);
    return { success: true, data: true, message: 'Investment withdrawn successfully' };
  }

  // Utility methods
  async uploadImage(file: File): Promise<{ hash: string; url: string }> {
    await this.delay(2000);
    return {
      hash: 'QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9',
      url: URL.createObjectURL(file),
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const sdk = new MockVillageInsuranceSDK();