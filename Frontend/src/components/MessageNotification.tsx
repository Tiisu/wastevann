import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { MessageCircle } from 'lucide-react';
import messageAPI from '../services/messageApi';
import { useContract } from '../context/ContractContext';

interface MessageNotificationProps {
  reportId: number;
  lastChecked?: number; // timestamp of when user last checked messages
  className?: string;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({
  reportId,
  lastChecked = 0,
  className = '',
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useContract();

  useEffect(() => {
    if (account) {
      checkUnreadMessages();
    }
  }, [reportId, lastChecked, account]);

  const checkUnreadMessages = async () => {
    if (!account) return;
    
    try {
      setIsLoading(true);
      
      // Get messages for the report
      const response = await messageAPI.getReportMessages(reportId);
      
      if (response.success && response.messages) {
        // Count messages newer than lastChecked timestamp and not from current user
        const lastCheckedDate = new Date(lastChecked);
        const unread = response.messages.filter(message => 
          new Date(message.timestamp) > lastCheckedDate && 
          message.sender.toLowerCase() !== account.toLowerCase()
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error checking unread messages:', error);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <MessageCircle className="h-4 w-4 text-muted-foreground" />
      {unreadCount > 0 && (
        <Badge variant="destructive" className="text-xs px-1 py-0 min-w-[16px] h-4">
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );
};

export default MessageNotification;