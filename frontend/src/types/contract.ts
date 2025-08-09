// Contract types matching your Soroban contract structures

export interface User {
  address: string;
  name: string;
  credit_score: number;
  status: UserStatus;
  join_date: string;
  is_dao_member: boolean;
  reputation_score: number;
  staked_amount: string;
  last_vote_timestamp: string;
}

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
  Banned = 'Banned',
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  params: PolicyParams;
  status: PolicyStatus;
  created_at: string;
  creator: string;
}

export interface PolicyParams {
  max_claim_amount: string;
  interest_rate: number; // basis points
  premium_amount: string;
  claim_cooldown_days: number;
  investor_lock_in_days: number;
  requires_dao_approval: boolean;
  credit_slash_on_reject: number;
}

export enum PolicyStatus {
  Pending = 'Pending',
  Active = 'Active',
  Archived = 'Archived',
  Deleted = 'Deleted',
}

export interface Subscription {
  id: string;
  policy_id: string;
  subscriber: string;
  start_date: string;
  status: SubscriptionStatus;
  last_payment_date: string;
  next_payment_due: string;
  weeks_paid: number;
  weeks_due: number;
  total_premiums_paid: string;
}

export enum SubscriptionStatus {
  Active = 'Active',
  GracePeriod = 'GracePeriod',
  Suspended = 'Suspended',
  Cancelled = 'Cancelled',
}

export interface Claim {
  id: string;
  subscription_id: string;
  claimer: string;
  amount: string;
  image_hash: string;
  description: string;
  status: ClaimStatus;
  created_at: string;
  plan_id: string;
  user: string;
  claim_type: ClaimType;
  evidence_hash: string;
  submission_date: string;
  assessor_notes: string;
  payout_date?: string;
}

export enum ClaimStatus {
  Submitted = 'Submitted',
  UnderReview = 'UnderReview',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Paid = 'Paid',
  Disputed = 'Disputed',
}

export enum ClaimType {
  Medical = 'Medical',
  Crop = 'Crop',
  Livestock = 'Livestock',
  Property = 'Property',
  Emergency = 'Emergency',
}

export interface Proposal {
  id: string;
  proposer: string;
  proposal_type: ProposalType;
  title: string;
  description: string;
  voting_period_end: string;
  votes_for: number;
  votes_against: number;
  status: ProposalStatus;
  execution_data: string;
  quorum_required: number;
  created_date: string;
}

export enum ProposalType {
  UserApproval = 'UserApproval',
  PlanManagement = 'PlanManagement',
  Financial = 'Financial',
  Governance = 'Governance',
}

export enum ProposalStatus {
  Active = 'Active',
  Passed = 'Passed',
  Rejected = 'Rejected',
  Executed = 'Executed',
}

export interface SafetyPool {
  total_balance: string;
  premium_contributions: string;
  claim_payouts: string;
  investment_returns: string;
  reserve_ratio: number;
  last_audit_date: string;
  minimum_reserve: string;
}

export interface Payment {
  user: string;
  plan_id: string;
  amount: string;
  week_number: number;
  payment_date: string;
  penalty_applied: string;
}

export interface PlatformConfig {
  grace_period_weeks: number;
  minimum_quorum: number;
  proposal_duration_days: number;
  max_claim_amount_ratio: number;
  penalty_rate: number;
  council_size: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FinancialSummary {
  total_premiums: string;
  total_claims: string;
  net_balance: string;
  reserve_percentage: string;
}

export interface ClaimStatistics {
  total_claims: number;
  total_paid_amount: string;
  total_pending_amount: string;
  approval_rate_percent: number;
}

// UI specific types
export interface WalletConnection {
  isConnected: boolean;
  address?: string;
  balance?: string;
}

export interface TransactionStatus {
  id: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: number;
}