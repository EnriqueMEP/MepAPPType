// filepath: backend/src/controllers/ChatController.ts
import { Request, Response } from 'express';
import ChatService from '../services/ChatService';
import { ApiResponseBuilder } from '../utils/response';
import { AuthenticatedRequest } from '../types/common';

export class ChatController {  // Chat Rooms
  async getAllChatRooms(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const userId = req.user.id;
      const rooms = await ChatService.getAllChatRooms(userId);
      ApiResponseBuilder.success(res, rooms, 'Chat rooms retrieved successfully');
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve chat rooms', 500);
    }
  }
  async getChatRoomById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { id } = req.params;
      const room = await ChatService.getChatRoomById(id);
      
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      // Check if user has access to this room
      const userId = req.user.id;
      if (room.created_by !== userId && !room.participants.includes(userId)) {
        return ApiResponseBuilder.error(res, 'Access denied to this chat room', 403);
      }
      
      ApiResponseBuilder.success(res, room, 'Chat room retrieved successfully');
    } catch (error) {
      console.error('Error getting chat room:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve chat room', 500);
    }
  }
  async createChatRoom(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const roomData = req.body;
      // Set created_by to current user
      roomData.created_by = req.user.id;
      
      // Add creator to participants if not already included
      if (!roomData.participants) {
        roomData.participants = [req.user.id];
      } else if (!roomData.participants.includes(req.user.id)) {
        roomData.participants.push(req.user.id);
      }
      
      const room = await ChatService.createChatRoom(roomData);
      ApiResponseBuilder.success(res, room, 'Chat room created successfully', 201);
    } catch (error) {
      console.error('Error creating chat room:', error);
      ApiResponseBuilder.error(res, 'Failed to create chat room', 500);
    }
  }
  async updateChatRoom(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { id } = req.params;
      const updateData = req.body;
      
      // Check if user has permission to update this room
      const room = await ChatService.getChatRoomById(id);
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      const userId = req.user.id;
      if (room.created_by !== userId) {
        return ApiResponseBuilder.error(res, 'Only room creator can update room details', 403);
      }
      
      const updatedRoom = await ChatService.updateChatRoom(id, updateData);
      ApiResponseBuilder.success(res, updatedRoom, 'Chat room updated successfully');
    } catch (error) {
      console.error('Error updating chat room:', error);
      ApiResponseBuilder.error(res, 'Failed to update chat room', 500);
    }
  }
  async deleteChatRoom(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { id } = req.params;
      
      // Check if user has permission to delete this room
      const room = await ChatService.getChatRoomById(id);
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      const userId = req.user.id;
      if (room.created_by !== userId) {
        return ApiResponseBuilder.error(res, 'Only room creator can delete the room', 403);
      }
      
      const deleted = await ChatService.deleteChatRoom(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Chat room deleted successfully');
    } catch (error) {
      console.error('Error deleting chat room:', error);
      ApiResponseBuilder.error(res, 'Failed to delete chat room', 500);
    }
  }
  async addParticipant(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { roomId } = req.params;
      const { userId } = req.body;
      
      // Check if current user has permission to add participants
      const room = await ChatService.getChatRoomById(roomId);
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      const currentUserId = req.user.id;
      if (room.created_by !== currentUserId && !room.participants.includes(currentUserId)) {
        return ApiResponseBuilder.error(res, 'Access denied to this chat room', 403);
      }
      
      const updatedRoom = await ChatService.addParticipant(roomId, userId);
      
      if (!updatedRoom) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      ApiResponseBuilder.success(res, updatedRoom, 'Participant added successfully');
    } catch (error) {
      console.error('Error adding participant:', error);
      ApiResponseBuilder.error(res, 'Failed to add participant', 500);
    }
  }
  async removeParticipant(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { roomId } = req.params;
      const { userId } = req.body;
      
      // Check if current user has permission to remove participants
      const room = await ChatService.getChatRoomById(roomId);
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      const currentUserId = req.user.id;
      // Users can remove themselves, or creator can remove others
      if (currentUserId !== userId && room.created_by !== currentUserId) {
        return ApiResponseBuilder.error(res, 'Permission denied to remove this participant', 403);
      }
      
      const updatedRoom = await ChatService.removeParticipant(roomId, userId);
      
      if (!updatedRoom) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      ApiResponseBuilder.success(res, updatedRoom, 'Participant removed successfully');
    } catch (error) {
      console.error('Error removing participant:', error);
      ApiResponseBuilder.error(res, 'Failed to remove participant', 500);
    }
  }
  async createDirectMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { userId } = req.body;
      const currentUserId = req.user.id;
      
      if (currentUserId === userId) {
        return ApiResponseBuilder.error(res, 'Cannot create direct message with yourself', 400);
      }
      
      const room = await ChatService.createDirectMessageRoom(currentUserId, userId);
      ApiResponseBuilder.success(res, room, 'Direct message room created successfully', 201);
    } catch (error) {
      console.error('Error creating direct message:', error);
      ApiResponseBuilder.error(res, 'Failed to create direct message', 500);
    }
  }
  // Chat Messages
  async getMessagesByRoom(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { roomId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      // Check if user has access to this room
      const room = await ChatService.getChatRoomById(roomId);
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      const userId = req.user.id;
      if (room.created_by !== userId && !room.participants.includes(userId)) {
        return ApiResponseBuilder.error(res, 'Access denied to this chat room', 403);
      }
      
      const messages = await ChatService.getMessagesByRoom(
        roomId,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      
      ApiResponseBuilder.success(res, messages, 'Messages retrieved successfully');
    } catch (error) {
      console.error('Error getting messages:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve messages', 500);
    }
  }
  async createMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }      const messageData = req.body;
      // Set sender_id to current user
      messageData.sender_id = req.user.id;
      
      // Check if user has access to this room
      const room = await ChatService.getChatRoomById(messageData.room_id);
      if (!room) {
        return ApiResponseBuilder.error(res, 'Chat room not found', 404);
      }
      
      const userId = req.user.id;
      if (room.created_by !== userId && !room.participants.includes(userId)) {
        return ApiResponseBuilder.error(res, 'Access denied to this chat room', 403);
      }
      
      const message = await ChatService.createMessage(messageData);
      ApiResponseBuilder.success(res, message, 'Message sent successfully', 201);
    } catch (error) {
      console.error('Error creating message:', error);
      ApiResponseBuilder.error(res, 'Failed to send message', 500);
    }
  }
  async updateMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { id } = req.params;
      const { content } = req.body;
        // Check if user owns this message
      const message = await ChatService.getMessageById(id);
      if (!message) {
        return ApiResponseBuilder.error(res, 'Message not found', 404);
      }
      
      if (message.sender_id !== req.user.id) {
        return ApiResponseBuilder.error(res, 'You can only edit your own messages', 403);
      }
      
      const updatedMessage = await ChatService.updateMessage(id, content);
      
      if (!updatedMessage) {
        return ApiResponseBuilder.error(res, 'Message not found', 404);
      }
      
      ApiResponseBuilder.success(res, updatedMessage, 'Message updated successfully');
    } catch (error) {
      console.error('Error updating message:', error);
      ApiResponseBuilder.error(res, 'Failed to update message', 500);
    }
  }
  async deleteMessage(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { id } = req.params;
      const { permanent = false } = req.query;
        // Check if user owns this message
      const message = await ChatService.getMessageById(id);
      if (!message) {
        return ApiResponseBuilder.error(res, 'Message not found', 404);
      }
      
      if (message.sender_id !== req.user.id) {
        return ApiResponseBuilder.error(res, 'You can only delete your own messages', 403);
      }
      
      const deleted = await ChatService.deleteMessage(id, permanent !== 'true');
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Message not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      ApiResponseBuilder.error(res, 'Failed to delete message', 500);
    }
  }
  async addReaction(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = req.user.id;
      
      const message = await ChatService.addReaction(messageId, userId, emoji);
      
      if (!message) {
        return ApiResponseBuilder.error(res, 'Message not found', 404);
      }
      
      ApiResponseBuilder.success(res, message, 'Reaction added successfully');
    } catch (error) {
      console.error('Error adding reaction:', error);
      ApiResponseBuilder.error(res, 'Failed to add reaction', 500);
    }
  }
  async removeReaction(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = req.user.id;
      
      const message = await ChatService.removeReaction(messageId, userId, emoji);
      
      if (!message) {
        return ApiResponseBuilder.error(res, 'Message not found', 404);
      }
      
      ApiResponseBuilder.success(res, message, 'Reaction removed successfully');
    } catch (error) {
      console.error('Error removing reaction:', error);
      ApiResponseBuilder.error(res, 'Failed to remove reaction', 500);
    }
  }
  async searchMessages(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { query, roomId, limit = 20 } = req.query;
      
      if (!query) {
        return ApiResponseBuilder.error(res, 'Search query is required', 400);
      }
      
      const userId = req.user.id;
      const messages = await ChatService.searchMessages(
        query as string,
        roomId as string,
        undefined, // Don't filter by user in search
        parseInt(limit as string)
      );
      
      ApiResponseBuilder.success(res, messages, 'Messages found successfully');
    } catch (error) {
      console.error('Error searching messages:', error);
      ApiResponseBuilder.error(res, 'Failed to search messages', 500);
    }
  }

  // Analytics
  async getChatStats(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.query;
      const stats = await ChatService.getChatStats(roomId as string);
      ApiResponseBuilder.success(res, stats, 'Chat stats retrieved successfully');
    } catch (error) {
      console.error('Error getting chat stats:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve chat stats', 500);
    }
  }

  async getRoomActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const { days = 7 } = req.query;
      
      const activity = await ChatService.getRoomActivity(roomId, parseInt(days as string));
      ApiResponseBuilder.success(res, activity, 'Room activity retrieved successfully');
    } catch (error) {
      console.error('Error getting room activity:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve room activity', 500);
    }
  }

  async getUserActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { days = 30 } = req.query;
      
      const activity = await ChatService.getUserActivity(userId, parseInt(days as string));
      ApiResponseBuilder.success(res, activity, 'User activity retrieved successfully');
    } catch (error) {
      console.error('Error getting user activity:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve user activity', 500);
    }
  }
  async getMyActivity(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const { days = 30 } = req.query;
      const userId = req.user.id;
      
      const activity = await ChatService.getUserActivity(userId, parseInt(days as string));
      ApiResponseBuilder.success(res, activity, 'My activity retrieved successfully');
    } catch (error) {
      console.error('Error getting my activity:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve my activity', 500);
    }
  }
}

export default new ChatController();
