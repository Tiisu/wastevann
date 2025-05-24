import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';

interface RejectWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => Promise<void>;
  reportId: number;
}

const RejectWasteModal: React.FC<RejectWasteModalProps> = ({
  isOpen,
  onClose,
  onReject,
  reportId
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Rejection reason must be at least 10 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onReject(reason.trim());
      
      // Reset form and close modal
      setReason('');
      onClose();
    } catch (err) {
      console.error('Error rejecting waste:', err);
      setError('Failed to reject waste. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Reject Waste Report #{reportId}
          </DialogTitle>
          <DialogDescription>
            Please provide a clear reason for rejecting this waste report. This will be visible to the user.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g., Image quality is too poor to verify waste type, Location does not match reported coordinates, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="mt-2 min-h-[100px]"
              maxLength={500}
            />
            <div className="text-sm text-gray-500 mt-1">
              {reason.length}/500 characters (minimum 10 required)
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim() || reason.trim().length < 10}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              'Reject Waste'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectWasteModal;
