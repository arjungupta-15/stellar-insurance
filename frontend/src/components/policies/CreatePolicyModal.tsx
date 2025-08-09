import { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useCreatePolicy } from '../../hooks/useContract';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePolicyModal({ isOpen, onClose }: CreatePolicyModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxClaimAmount: '',
    interestRate: 500, // 5% in basis points
    premiumAmount: '',
    claimCooldownDays: 30,
    investorLockInDays: 90,
    requiresDaoApproval: true,
    creditSlashOnReject: 10,
  });

  const createPolicy = useCreatePolicy();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPolicy.mutateAsync({
        title: formData.title,
        description: formData.description,
        maxClaimAmount: (parseFloat(formData.maxClaimAmount) * 1e7).toString(), // Convert to stroops
        interestRate: formData.interestRate,
        premiumAmount: (parseFloat(formData.premiumAmount) * 1e7).toString(), // Convert to stroops
        claimCooldownDays: formData.claimCooldownDays,
        investorLockInDays: formData.investorLockInDays,
        requiresDaoApproval: formData.requiresDaoApproval,
        creditSlashOnReject: formData.creditSlashOnReject,
      });
      
      onClose();
      setFormData({
        title: '',
        description: '',
        maxClaimAmount: '',
        interestRate: 500,
        premiumAmount: '',
        claimCooldownDays: 30,
        investorLockInDays: 90,
        requiresDaoApproval: true,
        creditSlashOnReject: 10,
      });
    } catch (error) {
      console.error('Failed to create policy:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Policy" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="label">
              Policy Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Crop Loss Protection"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input"
              placeholder="Describe what this policy covers..."
              required
            />
          </div>

          {/* Financial Parameters */}
          <div>
            <label htmlFor="premiumAmount" className="label">
              Weekly Premium (XLM) *
            </label>
            <input
              type="number"
              id="premiumAmount"
              name="premiumAmount"
              value={formData.premiumAmount}
              onChange={handleChange}
              className="input"
              placeholder="50"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="maxClaimAmount" className="label">
              Maximum Claim Amount (XLM) *
            </label>
            <input
              type="number"
              id="maxClaimAmount"
              name="maxClaimAmount"
              value={formData.maxClaimAmount}
              onChange={handleChange}
              className="input"
              placeholder="5000"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="interestRate" className="label">
              Interest Rate (basis points)
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className="input"
              placeholder="500"
              min="0"
              max="10000"
            />
            <p className="text-xs text-gray-500 mt-1">
              500 basis points = 5%
            </p>
          </div>

          <div>
            <label htmlFor="creditSlashOnReject" className="label">
              Credit Score Penalty
            </label>
            <input
              type="number"
              id="creditSlashOnReject"
              name="creditSlashOnReject"
              value={formData.creditSlashOnReject}
              onChange={handleChange}
              className="input"
              placeholder="10"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Points deducted for rejected claims
            </p>
          </div>

          {/* Time Parameters */}
          <div>
            <label htmlFor="claimCooldownDays" className="label">
              Claim Cooldown (days)
            </label>
            <input
              type="number"
              id="claimCooldownDays"
              name="claimCooldownDays"
              value={formData.claimCooldownDays}
              onChange={handleChange}
              className="input"
              placeholder="30"
              min="1"
            />
          </div>

          <div>
            <label htmlFor="investorLockInDays" className="label">
              Investor Lock-in Period (days)
            </label>
            <input
              type="number"
              id="investorLockInDays"
              name="investorLockInDays"
              value={formData.investorLockInDays}
              onChange={handleChange}
              className="input"
              placeholder="90"
              min="1"
            />
          </div>

          {/* Governance */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresDaoApproval"
                name="requiresDaoApproval"
                checked={formData.requiresDaoApproval}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="requiresDaoApproval" className="label">
                Require DAO approval for claims
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              When enabled, all claims will require DAO voting for approval
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={createPolicy.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createPolicy.isPending}
          >
            {createPolicy.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Creating Proposal...
              </>
            ) : (
              'Create Policy Proposal'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}