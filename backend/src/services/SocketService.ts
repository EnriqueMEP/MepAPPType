// filepath: backend/src/services/SocketService.ts
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import ChatService from './ChatService';
import { CreateMessageRequest, MessageType } from '../types/chat';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

export class SocketService {
  private io: Server;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: config.chat.socketCorsOrigin || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupAuthentication();
    this.setupEventHandlers();
  }

  private setupAuthentication() {
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = verify(token as string, config.jwt.secret) as any;
        socket.userId = decoded.id;
        socket.userName = decoded.name;
        
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.userName} (${socket.userId}) connected with socket ${socket.id}`);
      
      // Store user connection
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
        
        // Notify about user online status
        this.broadcastUserStatus(socket.userId, 'online');
      }

      // Join chat rooms
      socket.on('join-room', async (roomId: string) => {
        try {
          // Verify user has access to the room
          const room = await ChatService.getChatRoomById(roomId);
          if (room && socket.userId && 
              (room.created_by === socket.userId || room.participants.includes(socket.userId))) {
            socket.join(roomId);
            socket.emit('joined-room', { roomId, success: true });
            console.log(`User ${socket.userName} joined room ${roomId}`);
          } else {
            socket.emit('joined-room', { roomId, success: false, error: 'Access denied' });
          }
        } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('joined-room', { roomId, success: false, error: 'Server error' });
        }
      });

      // Leave chat room
      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
        socket.emit('left-room', { roomId });
        console.log(`User ${socket.userName} left room ${roomId}`);
      });

      // Handle new messages
      socket.on('send-message', async (data: {
        roomId: string;
        content: string;
        type?: string;
        replyToId?: string;
        attachments?: string[];
        mentions?: string[];
      }) => {
        try {
          if (!socket.userId) return;

          const messageData: CreateMessageRequest = {
            content: data.content,
            type: (data.type as MessageType) || MessageType.TEXT,
            room_id: data.roomId,
            sender_id: socket.userId,
            reply_to_id: data.replyToId,
            attachments: data.attachments || [],
            mentions: data.mentions || []
          };

          const message = await ChatService.createMessage(messageData);
          
          // Broadcast message to all users in the room
          this.io.to(data.roomId).emit('new-message', message);
          
          // Send notifications to mentioned users
          if (data.mentions && data.mentions.length > 0) {
            this.sendMentionNotifications(data.mentions, message, data.roomId);
          }
          
          console.log(`Message sent in room ${data.roomId} by ${socket.userName}`);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('message-error', { error: 'Failed to send message' });
        }
      });

      // Handle message updates
      socket.on('update-message', async (data: {
        messageId: string;
        content: string;
        roomId: string;
      }) => {
        try {
          if (!socket.userId) return;

          const message = await ChatService.getMessageById(data.messageId);
          if (message && message.sender_id === socket.userId) {
            const updatedMessage = await ChatService.updateMessage(data.messageId, data.content);
            if (updatedMessage) {
              this.io.to(data.roomId).emit('message-updated', updatedMessage);
            }
          }
        } catch (error) {
          console.error('Error updating message:', error);
          socket.emit('message-error', { error: 'Failed to update message' });
        }
      });

      // Handle message deletion
      socket.on('delete-message', async (data: {
        messageId: string;
        roomId: string;
      }) => {
        try {
          if (!socket.userId) return;

          const message = await ChatService.getMessageById(data.messageId);
          if (message && message.sender_id === socket.userId) {
            const deleted = await ChatService.deleteMessage(data.messageId, true);
            if (deleted) {
              this.io.to(data.roomId).emit('message-deleted', {
                messageId: data.messageId,
                roomId: data.roomId
              });
            }
          }
        } catch (error) {
          console.error('Error deleting message:', error);
          socket.emit('message-error', { error: 'Failed to delete message' });
        }
      });

      // Handle reactions
      socket.on('add-reaction', async (data: {
        messageId: string;
        emoji: string;
        roomId: string;
      }) => {
        try {
          if (!socket.userId) return;

          const message = await ChatService.addReaction(data.messageId, socket.userId, data.emoji);
          if (message) {
            this.io.to(data.roomId).emit('reaction-added', {
              messageId: data.messageId,
              emoji: data.emoji,
              userId: socket.userId,
              reactions: message.reactions
            });
          }
        } catch (error) {
          console.error('Error adding reaction:', error);
        }
      });

      socket.on('remove-reaction', async (data: {
        messageId: string;
        emoji: string;
        roomId: string;
      }) => {
        try {
          if (!socket.userId) return;

          const message = await ChatService.removeReaction(data.messageId, socket.userId, data.emoji);
          if (message) {
            this.io.to(data.roomId).emit('reaction-removed', {
              messageId: data.messageId,
              emoji: data.emoji,
              userId: socket.userId,
              reactions: message.reactions
            });
          }
        } catch (error) {
          console.error('Error removing reaction:', error);
        }
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { roomId: string }) => {
        socket.to(data.roomId).emit('user-typing', {
          userId: socket.userId,
          userName: socket.userName,
          roomId: data.roomId
        });
      });

      socket.on('typing-stop', (data: { roomId: string }) => {
        socket.to(data.roomId).emit('user-stopped-typing', {
          userId: socket.userId,
          roomId: data.roomId
        });
      });

      // Handle user status updates
      socket.on('status-update', (status: 'online' | 'away' | 'busy' | 'offline') => {
        if (socket.userId) {
          this.broadcastUserStatus(socket.userId, status);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${socket.userName} (${socket.userId}) disconnected`);
        
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.broadcastUserStatus(socket.userId, 'offline');
        }
      });
    });
  }

  private broadcastUserStatus(userId: string, status: string) {
    this.io.emit('user-status-changed', {
      userId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  private sendMentionNotifications(mentionedUserIds: string[], message: any, roomId: string) {
    mentionedUserIds.forEach(userId => {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.io.to(socketId).emit('mention-notification', {
          message,
          roomId,
          mentionedBy: message.sender_name
        });
      }
    });
  }

  // Public methods for external use
  public notifyNewChatRoom(roomId: string, participants: string[]) {
    participants.forEach(userId => {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.io.to(socketId).emit('new-chat-room', { roomId });
      }
    });
  }

  public notifyRoomUpdate(roomId: string, updateData: any) {
    this.io.to(roomId).emit('room-updated', {
      roomId,
      ...updateData
    });
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public sendDirectNotification(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }
  }

  public broadcastSystemMessage(roomId: string, message: string) {
    this.io.to(roomId).emit('system-message', {
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Get Socket.IO instance for external use
  public getIO(): Server {
    return this.io;
  }
}

let socketService: SocketService;

export const initializeSocketService = (server: HttpServer): SocketService => {
  socketService = new SocketService(server);
  return socketService;
};

export const getSocketService = (): SocketService => {
  if (!socketService) {
    throw new Error('Socket service not initialized');
  }
  return socketService;
};
