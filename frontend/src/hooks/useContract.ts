import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '../lib/mock-sdk';
import { 
  User, Policy, Subscription, Claim, Proposal, SafetyPool,
  ClaimType, ProposalType, ApiResponse
} from '../types/contract';

// Query keys
export const queryKeys = {
  user: (address?: string) => ['user', address],
  policies: () => ['policies'],
  policy: (id: string) => ['policy', id],
  subscriptions: (address?: string) => ['subscriptions', address],
  subscription: (id: string) => ['subscription', id],
  claims: () => ['claims'],
  userClaims: (address?: string) => ['userClaims', address],
  proposals: () => ['proposals'],
  safetyPool: () => ['safetyPool'],
  financialSummary: () => ['financialSummary'],
  claimStatistics: () => ['claimStatistics'],
  walletConnection: () => ['walletConnection'],
};

// Wallet connection hooks
export function useWalletConnection() {
  return useQuery({
    queryKey: queryKeys.walletConnection(),
    queryFn: async () => ({
      isConnected: sdk.isWalletConnected(),
      address: sdk.getCurrentUser(),
    }),
    refetchInterval: 5000,
  });
}

export function useConnectWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => sdk.connect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.walletConnection() });
    },
  });
}

export function useDisconnectWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => sdk.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.walletConnection() });
    },
  });
}

// User management hooks
export function useUser(address?: string) {
  return useQuery({
    queryKey: queryKeys.user(address),
    queryFn: () => sdk.getUser(address),
    enabled: !!address || sdk.isWalletConnected(),
  });
}

export function useRegisterUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name?: string) => sdk.registerUser(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
    },
  });
}

// Policy management hooks
export function usePolicies() {
  return useQuery({
    queryKey: queryKeys.policies(),
    queryFn: () => sdk.getPolicies(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function usePolicy(policyId: string) {
  return useQuery({
    queryKey: queryKeys.policy(policyId),
    queryFn: () => sdk.getPolicy(policyId),
    enabled: !!policyId,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      title: string;
      description: string;
      maxClaimAmount: string;
      interestRate: number;
      premiumAmount: string;
      claimCooldownDays: number;
      investorLockInDays: number;
      requiresDaoApproval: boolean;
      creditSlashOnReject: number;
    }) => sdk.createPolicy(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies() });
      queryClient.invalidateQueries({ queryKey: queryKeys.proposals() });
    },
  });
}

// Subscription management hooks
export function useUserSubscriptions(address?: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions(address),
    queryFn: () => sdk.getUserSubscriptions(address),
    enabled: !!address || sdk.isWalletConnected(),
  });
}

export function useSubscription(subscriptionId: string) {
  return useQuery({
    queryKey: queryKeys.subscription(subscriptionId),
    queryFn: () => sdk.getSubscription(subscriptionId),
    enabled: !!subscriptionId,
  });
}

export function useSubscribeToPolicy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (policyId: string) => sdk.subscribeToPolicy(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.policies() });
    },
  });
}

export function usePayPremium() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionId: string) => sdk.payPremium(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.safetyPool() });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionId: string) => sdk.cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions() });
    },
  });
}

// Claims management hooks
export function useClaims() {
  return useQuery({
    queryKey: queryKeys.claims(),
    queryFn: () => sdk.getClaims(),
    refetchInterval: 15000, // Refetch every 15 seconds for voting updates
  });
}

export function useUserClaims(address?: string) {
  return useQuery({
    queryKey: queryKeys.userClaims(address),
    queryFn: () => sdk.getUserClaims(address),
    enabled: !!address || sdk.isWalletConnected(),
  });
}

export function useSubmitClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      subscriptionId: string;
      amount: string;
      claimType: ClaimType;
      description: string;
      imageFile: File;
    }) => sdk.submitClaim(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userClaims() });
    },
  });
}

export function useVoteClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, approve }: { claimId: string; approve: boolean }) => 
      sdk.voteClaim(claimId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims() });
    },
  });
}

export function useApproveClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (claimId: string) => sdk.approveClaim(claimId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims() });
      queryClient.invalidateQueries({ queryKey: queryKeys.safetyPool() });
    },
  });
}

export function useRejectClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, reason }: { claimId: string; reason: string }) => 
      sdk.rejectClaim(claimId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims() });
    },
  });
}

// DAO governance hooks
export function useProposals() {
  return useQuery({
    queryKey: queryKeys.proposals(),
    queryFn: () => sdk.getProposals(),
    refetchInterval: 15000, // Refetch every 15 seconds for voting updates
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: {
      type: ProposalType;
      title: string;
      description: string;
      executionData: string;
    }) => sdk.createProposal(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proposals() });
    },
  });
}

export function useVoteProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ proposalId, voteFor }: { proposalId: string; voteFor: boolean }) => 
      sdk.voteProposal(proposalId, voteFor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proposals() });
    },
  });
}

export function useExecuteProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (proposalId: string) => sdk.executeProposal(proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proposals() });
      // Invalidate other relevant queries based on proposal type
      queryClient.invalidateQueries({ queryKey: queryKeys.policies() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user() });
    },
  });
}

// Financial management hooks
export function useSafetyPool() {
  return useQuery({
    queryKey: queryKeys.safetyPool(),
    queryFn: () => sdk.getSafetyPoolDetails(),
    refetchInterval: 30000,
  });
}

export function useFinancialSummary() {
  return useQuery({
    queryKey: queryKeys.financialSummary(),
    queryFn: () => sdk.getFinancialSummary(),
    refetchInterval: 60000,
  });
}

export function useClaimStatistics() {
  return useQuery({
    queryKey: queryKeys.claimStatistics(),
    queryFn: () => sdk.getClaimStatistics(),
    refetchInterval: 60000,
  });
}

export function useAddExternalFunding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: string) => sdk.addExternalFunding(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.safetyPool() });
      queryClient.invalidateQueries({ queryKey: queryKeys.financialSummary() });
    },
  });
}

export function useWithdrawReserveFunds() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ amount, purpose }: { amount: string; purpose: string }) => 
      sdk.withdrawReserveFunds(amount, purpose),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.safetyPool() });
      queryClient.invalidateQueries({ queryKey: queryKeys.financialSummary() });
    },
  });
}

// Investment management hooks
export function useDepositInvestment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: string) => sdk.depositInvestment(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.safetyPool() });
    },
  });
}

export function useWithdrawInvestment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: string) => sdk.withdrawInvestment(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.safetyPool() });
    },
  });
}