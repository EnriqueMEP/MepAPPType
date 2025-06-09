// filepath: backend/src/services/ChatService.ts
import knex from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import {
  ChatRoom,
  LegacyChatMessage as ChatMessage,
  CreateChatRoomRequest,
  CreateMessageRequest,
  UpdateChatRoomRequest,
  ChatRoomType,
  MessageReaction,
  MessageType
} from '../types/chat';

export class ChatService {
  // Chat Rooms
  async getAllChatRooms(userId: string): Promise<ChatRoom[]> {
    return await knex('chat_rooms')
      .leftJoin('users as creators', 'chat_rooms.created_by', 'creators.id')
      .select(
        'chat_rooms.*',
        'creators.name as creator_name'
      )
      .where(function() {
        this.where('chat_rooms.created_by', userId)
            .orWhereRaw('? = ANY(chat_rooms.participants)', [userId]);
      })
      .orderBy('chat_rooms.updated_at', 'desc');
  }

  async getChatRoomById(id: string): Promise<ChatRoom | null> {
    const room = await knex('chat_rooms')
      .leftJoin('users as creators', 'chat_rooms.created_by', 'creators.id')
      .select(
        'chat_rooms.*',
        'creators.name as creator_name'
      )
      .where('chat_rooms.id', id)
      .first();
    
    return room || null;
  }

  async createChatRoom(data: CreateChatRoomRequest): Promise<ChatRoom> {
    const room: Omit<ChatRoom, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      type: data.type || 'group',
      is_private: data.is_private || false,
      created_by: data.created_by,
      participants: data.participants || [],
      avatar: data.avatar,
      settings: data.settings || {
        allowFileSharing: true,
        allowMentions: true,
        muteNotifications: false
      },
      last_message_id: undefined,
      last_activity: new Date()
    };

    await knex('chat_rooms').insert(room);
    return await this.getChatRoomById(room.id) as ChatRoom;
  }

  async updateChatRoom(id: string, data: UpdateChatRoomRequest): Promise<ChatRoom | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await knex('chat_rooms')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getChatRoomById(id);
  }

  async deleteChatRoom(id: string): Promise<boolean> {
    // Delete all messages first
    await knex('chat_messages').where('room_id', id).del();
    
    const deleted = await knex('chat_rooms')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  async addParticipant(roomId: string, userId: string): Promise<ChatRoom | null> {
    const room = await this.getChatRoomById(roomId);
    if (!room) {
      return null;
    }

    const participants = [...room.participants];
    if (!participants.includes(userId)) {
      participants.push(userId);
      return await this.updateChatRoom(roomId, { participants });
    }

    return room;
  }

  async removeParticipant(roomId: string, userId: string): Promise<ChatRoom | null> {
    const room = await this.getChatRoomById(roomId);
    if (!room) {
      return null;
    }

    const participants = room.participants.filter((id: string) => id !== userId);
    return await this.updateChatRoom(roomId, { participants });
  }

  async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    return await this.getAllChatRooms(userId);
  }

  async getDirectMessageRoom(user1Id: string, user2Id: string): Promise<ChatRoom | null> {
    const room = await knex('chat_rooms')
      .where('type', 'direct')
      .where(function() {
        this.whereRaw('participants @> ?', [JSON.stringify([user1Id, user2Id])])
            .orWhereRaw('participants @> ?', [JSON.stringify([user2Id, user1Id])]);
      })
      .first();

    return room || null;
  }

  async createDirectMessageRoom(user1Id: string, user2Id: string): Promise<ChatRoom> {
    // Check if room already exists
    const existingRoom = await this.getDirectMessageRoom(user1Id, user2Id);
    if (existingRoom) {
      return existingRoom;
    }

    // Get user names for room name
    const users = await knex('users')
      .whereIn('id', [user1Id, user2Id])
      .select('id', 'name');

    const user1Name = users.find(u => u.id === user1Id)?.name || 'User';
    const user2Name = users.find(u => u.id === user2Id)?.name || 'User';

    return await this.createChatRoom({
      name: `${user1Name}, ${user2Name}`,
      type: 'direct',
      is_private: true,
      created_by: user1Id,
      participants: [user1Id, user2Id]
    });
  }

  // Chat Messages
  async getMessagesByRoom(roomId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    return await knex('chat_messages')
      .leftJoin('users', 'chat_messages.sender_id', 'users.id')
      .select(
        'chat_messages.*',
        'users.name as sender_name',
        'users.avatar as sender_avatar'
      )
      .where('chat_messages.room_id', roomId)
      .orderBy('chat_messages.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  async getMessageById(id: string): Promise<ChatMessage | null> {
    const message = await knex('chat_messages')
      .leftJoin('users', 'chat_messages.sender_id', 'users.id')
      .select(
        'chat_messages.*',
        'users.name as sender_name',
        'users.avatar as sender_avatar'
      )
      .where('chat_messages.id', id)
      .first();
    
    return message || null;
  }

  async createMessage(data: CreateMessageRequest): Promise<ChatMessage> {
    const message: Omit<ChatMessage, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      content: data.content,
      type: (data.type as MessageType) || MessageType.TEXT,
      room_id: data.room_id,
      sender_id: data.sender_id,
      reply_to_id: data.reply_to_id,
      attachments: data.attachments || [],
      mentions: data.mentions || [],
      reactions: {},
      is_edited: false,
      is_deleted: false
    };

    await knex('chat_messages').insert(message);

    // Update room's last message and activity
    await knex('chat_rooms')
      .where('id', data.room_id)
      .update({
        last_message_id: message.id,
        last_activity: new Date(),
        updated_at: new Date()
      });

    return await this.getMessageById(message.id) as ChatMessage;
  }

  async updateMessage(id: string, content: string): Promise<ChatMessage | null> {
    const updated = await knex('chat_messages')
      .where('id', id)
      .update({
        content,
        is_edited: true,
        updated_at: new Date()
      });

    if (updated === 0) {
      return null;
    }

    return await this.getMessageById(id);
  }

  async deleteMessage(id: string, softDelete: boolean = true): Promise<boolean> {
    if (softDelete) {
      const updated = await knex('chat_messages')
        .where('id', id)
        .update({
          is_deleted: true,
          content: 'This message was deleted',
          updated_at: new Date()
        });

      return updated > 0;
    } else {
      const deleted = await knex('chat_messages')
        .where('id', id)
        .del();

      return deleted > 0;
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string): Promise<ChatMessage | null> {
    const message = await this.getMessageById(messageId);
    if (!message) {
      return null;
    }    const reactions: Record<string, string[]> = { ...message.reactions };
    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }

    if (!reactions[emoji].includes(userId)) {
      reactions[emoji].push(userId);
    }

    const updated = await knex('chat_messages')
      .where('id', messageId)
      .update({
        reactions,
        updated_at: new Date()
      });

    if (updated === 0) {
      return null;
    }

    return await this.getMessageById(messageId);
  }

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<ChatMessage | null> {
    const message = await this.getMessageById(messageId);
    if (!message) {
      return null;
    }    const reactions: Record<string, string[]> = { ...message.reactions };
    if (reactions[emoji]) {
      reactions[emoji] = reactions[emoji].filter((id: string) => id !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    }

    const updated = await knex('chat_messages')
      .where('id', messageId)
      .update({
        reactions,
        updated_at: new Date()
      });

    if (updated === 0) {
      return null;
    }

    return await this.getMessageById(messageId);
  }

  async searchMessages(query: string, roomId?: string, userId?: string, limit: number = 20): Promise<ChatMessage[]> {
    let queryBuilder = knex('chat_messages')
      .leftJoin('users', 'chat_messages.sender_id', 'users.id')
      .select(
        'chat_messages.*',
        'users.name as sender_name',
        'users.avatar as sender_avatar'
      )
      .where('chat_messages.content', 'ilike', `%${query}%`)
      .where('chat_messages.is_deleted', false);

    if (roomId) {
      queryBuilder = queryBuilder.where('chat_messages.room_id', roomId);
    }

    if (userId) {
      queryBuilder = queryBuilder.where('chat_messages.sender_id', userId);
    }

    return await queryBuilder
      .orderBy('chat_messages.created_at', 'desc')
      .limit(limit);
  }

  // Analytics and Reports
  async getChatStats(roomId?: string) {
    let baseQuery = knex('chat_messages')
      .where('is_deleted', false);

    if (roomId) {
      baseQuery = baseQuery.where('room_id', roomId);
    }

    const [
      totalMessages,
      totalRooms,
      messagesThisWeek,
      activeUsers,
      topSenders
    ] = await Promise.all([
      baseQuery.clone().count('* as count').first(),
      knex('chat_rooms').count('* as count').first(),
      baseQuery.clone()
        .where('created_at', '>=', knex.raw('CURRENT_DATE - INTERVAL \'7 days\''))
        .count('* as count').first(),
      baseQuery.clone()
        .distinct('sender_id')
        .where('created_at', '>=', knex.raw('CURRENT_DATE - INTERVAL \'30 days\''))
        .count('* as count').first(),
      baseQuery.clone()
        .leftJoin('users', 'chat_messages.sender_id', 'users.id')
        .select('users.name', 'users.id')
        .count('chat_messages.id as message_count')
        .groupBy('users.id', 'users.name')
        .orderBy('message_count', 'desc')
        .limit(5)
    ]);

    return {
      messages: {
        total: parseInt(totalMessages?.count as string) || 0,
        thisWeek: parseInt(messagesThisWeek?.count as string) || 0
      },
      rooms: {
        total: parseInt(totalRooms?.count as string) || 0
      },
      users: {
        active: parseInt(activeUsers?.count as string) || 0,
        topSenders: topSenders.map(sender => ({
          id: sender.id,
          name: sender.name,
          messageCount: parseInt(sender.message_count as string)
        }))
      }
    };
  }

  async getRoomActivity(roomId: string, days: number = 7): Promise<Array<{ date: string; messageCount: number }>> {
    const results = await knex('chat_messages')
      .select(knex.raw('DATE(created_at) as date'))
      .count('* as message_count')
      .where('room_id', roomId)
      .where('is_deleted', false)
      .where('created_at', '>=', knex.raw(`CURRENT_DATE - INTERVAL '${days} days'`))
      .groupBy(knex.raw('DATE(created_at)'))
      .orderBy('date', 'asc');    return results.map((row: any) => ({
      date: row.date,
      messageCount: parseInt(row.message_count as string)
    }));
  }

  async getUserActivity(userId: string, days: number = 30): Promise<{
    messagesSent: number;
    roomsParticipated: number;
    averageMessagesPerDay: number;
  }> {
    const [messagesSent, roomsParticipated] = await Promise.all([
      knex('chat_messages')
        .where('sender_id', userId)
        .where('is_deleted', false)
        .where('created_at', '>=', knex.raw(`CURRENT_DATE - INTERVAL '${days} days'`))
        .count('* as count').first(),
      knex('chat_messages')
        .distinct('room_id')
        .where('sender_id', userId)
        .where('is_deleted', false)
        .where('created_at', '>=', knex.raw(`CURRENT_DATE - INTERVAL '${days} days'`))
        .count('* as count').first()
    ]);

    const messageCount = parseInt(messagesSent?.count as string) || 0;
    const roomCount = parseInt(roomsParticipated?.count as string) || 0;
    const averageMessagesPerDay = messageCount / days;

    return {
      messagesSent: messageCount,
      roomsParticipated: roomCount,
      averageMessagesPerDay: Math.round(averageMessagesPerDay * 100) / 100
    };
  }

  async getUnreadMessages(userId: string): Promise<Array<{ roomId: string; unreadCount: number }>> {
    // This would require a user_read_status table to track what messages users have read
    // For now, return empty array as placeholder
    return [];
  }
}

export default new ChatService();
