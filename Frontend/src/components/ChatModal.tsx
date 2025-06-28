import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import ChatInterface from './ChatInterface';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  reporterAddress: string;
  collectedBy?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  reportId,
  reporterAddress,
  collectedBy,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Message Center</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <ChatInterface
            reportId={reportId}
            reporterAddress={reporterAddress}
            collectedBy={collectedBy}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;