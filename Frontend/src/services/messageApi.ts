import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export interface Message {
  messageId: string;
  reportId: number;
  sender: string;
  content: string;
  isFromAgent: boolean;
  timestamp: Date;
}

export interface SendMessageRequest {
  reportId: number;
  sender: string;
  content: string;
  isFromAgent: boolean;
  reporterAddress: string;
  collectedBy?: string;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  messages?: Message[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  unreadCount?: number;
  stats?: {
    totalSent: number;
    totalReceived: number;
    unreadCount: number;
  };
  error?: string;
}

class MessageAPI {
  private socket: Socket | null = null;

  // Initialize Socket.IO connection
  initializeSocket(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to message server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from message server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  // Join a report room for real-time updates
  joinReportRoom(reportId: number): void {
    if (this.socket) {
      this.socket.emit('join-report', reportId);
    }
  }

  // Leave a report room
  leaveReportRoom(reportId: number): void {
    if (this.socket) {
      this.socket.emit('leave-report', reportId);
    }
  }

  // Listen for new messages
  onNewMessage(callback: (message: Message) => void): void {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  // Remove message listener
  offNewMessage(): void {
    if (this.socket) {
      this.socket.off('new-message');
    }
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send a new message
  async sendMessage(messageData: SendMessageRequest): Promise<MessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Get messages for a specific report
  async getReportMessages(
    reportId: number,
    options: {
      limit?: number;
      offset?: number;
      since?: string;
    } = {}
  ): Promise<MessageResponse> {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.since) params.append('since', options.since);

      const response = await fetch(
        `${API_BASE_URL}/messages/report/${reportId}?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get messages');
      }

      // Convert timestamp strings to Date objects
      if (data.messages) {
        data.messages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }

      return data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  // Get unread message count for a user
  async getUnreadCount(
    address: string,
    since?: string
  ): Promise<MessageResponse> {
    try {
      const params = new URLSearchParams();
      if (since) params.append('since', since);

      const response = await fetch(
        `${API_BASE_URL}/messages/unread/${address}?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get unread count');
      }

      return data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markAsRead(reportId?: number, messageIds?: string[]): Promise<MessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId, messageIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark as read');
      }

      return data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  // Get message statistics for a user
  async getMessageStats(address: string): Promise<MessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/stats/${address}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get message stats');
      }

      return data;
    } catch (error) {
      console.error('Get message stats error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const messageAPI = new MessageAPI();
export default messageAPI;