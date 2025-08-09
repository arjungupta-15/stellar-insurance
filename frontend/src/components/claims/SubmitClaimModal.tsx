import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ClaimType } from '../../types/contract';
import { useSubmitClaim } from '../../hooks/useContract';
import { validateImageFile } from '../../lib/utils';

interface SubmitClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
  maxClaimAmount: string;
}

export function SubmitClaimModal({ 
  isOpen, 
  onClose, 
  subscriptionId, 
  maxClaimAmount 
}: SubmitClaimModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    claimType: ClaimType.Crop,
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const submitClaim = useSubmitClaim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      setImageError('Please upload evidence image');
      return;
    }

    try {
      await submitClaim.mutateAsync({
        subscriptionId,
        amount: (parseFloat(formData.amount) * 1e7).toString(), // Convert to stroops
        claimType: formData.claimType,
        description: formData.description,
        imageFile,
      });
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to submit claim:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid file');
      return;
    }

    setImageFile(file);
    setImageError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      claimType: ClaimType.Crop,
      description: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const maxAmount = parseFloat(maxClaimAmount) / 1e7; // Convert from stroops

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Insurance Claim" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="label">
              Claim Amount (XLM) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input"
              placeholder="1000"
              step="0.01"
              min="0"
              max={maxAmount}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {maxAmount.toLocaleString()} XLM
            </p>
          </div>

          <div>
            <label htmlFor="claimType" className="label">
              Claim Type *
            </label>
            <select
              id="claimType"
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value={ClaimType.Crop}>Crop Damage</option>
              <option value={ClaimType.Livestock}>Livestock Loss</option>
              <option value={ClaimType.Property}>Property Damage</option>
              <option value={ClaimType.Medical}>Medical Emergency</option>
              <option value={ClaimType.Emergency}>Other Emergency</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Provide detailed description of the incident and damage..."
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="label">Evidence Image *</label>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload evidence image
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB
                </p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Evidence preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-danger-600 text-white rounded-full p-1 hover:bg-danger-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {imageError && (
            <p className="text-sm text-danger-600 mt-2">{imageError}</p>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Claims will be reviewed by DAO members</li>
            <li>• Provide clear evidence and detailed description</li>
            <li>• False claims may result in credit score penalties</li>
            <li>• Processing time varies based on claim complexity</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={submitClaim.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitClaim.isPending || !imageFile}
          >
            {submitClaim.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Submitting...
              </>
            ) : (
              'Submit Claim'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}