import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useContract } from '../context/ContractContext';
import messageAPI, { Message } from '../services/messageApi';


interface ChatInterfaceProps {
  reportId: number;
  reporterAddress: string;
  collectedBy?: string;
  onClose?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  reportId, 
  reporterAddress, 
  collectedBy,
  onClose 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { account, isUser, isAgent } = useContract();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (reportId) {
      fetchMessages();
      setupRealTimeUpdates();
    }

    return () => {
      messageAPI.leaveReportRoom(reportId);
      messageAPI.offNewMessage();
    };
  }, [reportId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await messageAPI.getReportMessages(reportId);
      if (response.success && response.messages) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Initialize socket connection
    messageAPI.initializeSocket();
    
    // Join report room for real-time updates
    messageAPI.joinReportRoom(reportId);
    
    // Listen for new messages
    messageAPI.onNewMessage((newMessage: Message) => {
      if (newMessage.reportId === reportId) {
        setMessages(prev => [...prev, newMessage]);
      }
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !account) return;

    if (newMessage.length > 500) {
      toast.error('Message too long (max 500 characters)');
      return;
    }

    try {
      setIsSending(true);
      
      const messageData = {
        reportId,
        sender: account,
        content: newMessage.trim(),
        isFromAgent: isAgent,
        reporterAddress: reporterAddress,
        collectedBy: collectedBy || undefined
      };

      const response = await messageAPI.sendMessage(messageData);
      
      if (response.success) {
        setNewMessage('');
        toast.success('Message sent successfully!');
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMessageSenderInfo = (message: Message) => {
    const isCurrentUser = message.sender.toLowerCase() === account?.toLowerCase();
    const isReporter = message.sender.toLowerCase() === reporterAddress.toLowerCase();
    
    if (isCurrentUser) {
      return { label: 'You', isOwn: true };
    } else if (message.isFromAgent) {
      return { label: 'Agent', isOwn: false };
    } else if (isReporter) {
      return { label: 'Reporter', isOwn: false };
    } else {
      return { label: 'User', isOwn: false };
    }
  };

  const canSendMessage = () => {
    if (!account) return false;
    
    const isReporter = account.toLowerCase() === reporterAddress.toLowerCase();
    const isCollectingAgent = collectedBy && account.toLowerCase() === collectedBy.toLowerCase();
    
    // Users can message if they're the reporter or a verified agent
    // After collection, only reporter and collecting agent can message
    if (collectedBy) {
      return isReporter || isCollectingAgent;
    } else {
      return isReporter || isAgent;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <CardTitle className="text-lg">Chat - Report #{reportId}</CardTitle>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">No messages yet. Start the conversation!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const senderInfo = getMessageSenderInfo(message);
                return (
                  <div
                    key={message.messageId}
                    className={`flex ${senderInfo.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        senderInfo.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge 
                          variant={message.isFromAgent ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {message.isFromAgent ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {senderInfo.label}
                        </Badge>
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {canSendMessage() ? (
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message... (max 500 characters)"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              maxLength={500}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isSending}
              size="sm"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm p-4 bg-muted rounded-lg">
            {!account 
              ? 'Please connect your wallet to send messages'
              : collectedBy 
                ? 'Only the reporter and collecting agent can message after collection'
                : 'Only the reporter and verified agents can send messages'
            }
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          {newMessage.length}/500 characters
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;