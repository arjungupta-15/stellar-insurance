import { useState } from 'react';
import { 
  FileImage, 
  Calendar, 
  DollarSign, 
  User, 
  ThumbsUp, 
  ThumbsDown,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Claim } from '../../types/contract';
import { formatCurrency, formatDate, formatRelativeTime } from '../../lib/utils';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';

interface ClaimCardProps {
  claim: Claim;
  onVote?: (claimId: string, approve: boolean) => void;
  onApprove?: (claimId: string) => void;
  onReject?: (claimId: string, reason: string) => void;
  showVotingActions?: boolean;
  showAdminActions?: boolean;
  isUserClaim?: boolean;
}

export function ClaimCard({ 
  claim, 
  onVote, 
  onApprove, 
  onReject,
  showVotingActions = false,
  showAdminActions = false,
  isUserClaim = false
}: ClaimCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleVote = (approve: boolean) => {
    if (onVote) {
      onVote(claim.id, approve);
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(claim.id);
    }
  };

  const handleReject = () => {
    if (onReject && rejectReason.trim()) {
      onReject(claim.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const canVote = showVotingActions && claim.status === 'UnderReview';
  const canAdminAction = showAdminActions && (claim.status === 'Submitted' || claim.status === 'UnderReview');

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Claim #{claim.id}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={claim.status} />
                <span className="badge badge-primary">{claim.claim_type}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(claim.amount)}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(claim.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Claimant</p>
                <p className="text-sm font-medium text-gray-900">
                  {claim.claimer.slice(0, 8)}...{claim.claimer.slice(-4)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(claim.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">{claim.description}</p>
          </div>

          {/* Evidence */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Evidence</span>
              <button
                onClick={() => setShowImageModal(true)}
                className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-2">
              <FileImage className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Image Hash: {claim.image_hash.slice(0, 16)}...
              </span>
            </div>
          </div>

          {/* Assessor Notes */}
          {claim.assessor_notes && (
            <div className="mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Assessor Notes</span>
                </div>
                <p className="text-sm text-yellow-700">{claim.assessor_notes}</p>
              </div>
            </div>
          )}

          {/* Payout Date */}
          {claim.payout_date && (
            <div className="mb-4">
              <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                <p className="text-sm text-success-800">
                  <strong>Paid on:</strong> {formatDate(claim.payout_date)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {(canVote || canAdminAction) && (
          <div className="card-footer">
            <div className="flex space-x-2">
              {canVote && (
                <>
                  <button
                    onClick={() => handleVote(true)}
                    className="btn btn-success flex-1 flex items-center justify-center space-x-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleVote(false)}
                    className="btn btn-danger flex-1 flex items-center justify-center space-x-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}

              {canAdminAction && (
                <>
                  <button
                    onClick={handleApprove}
                    className="btn btn-success flex-1"
                  >
                    Approve & Pay
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="btn btn-danger flex-1"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Claim Evidence"
        size="lg"
      >
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Evidence Image</p>
            <p className="text-sm text-gray-500 font-mono">
              Hash: {claim.image_hash}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              In a real implementation, this would display the actual image from IPFS or similar storage
            </p>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Claim"
      >
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="rejectReason" className="label">
              Reason for Rejection *
            </label>
            <textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="input"
              placeholder="Please provide a detailed reason for rejecting this claim..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="btn btn-danger"
            >
              Reject Claim
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}