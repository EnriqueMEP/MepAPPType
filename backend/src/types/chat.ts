import { BaseEntity, User } from './common';

// Legacy ChatRoom interface for backwards compatibility
export interface ChatRoom extends BaseEntity {
  name: string;
  description?: string;
  type: ChatRoomType;
  is_private: boolean;
  created_by: string;
  participants: string[];
  avatar?: string;
  settings: ChatRoomSettings;
  last_message_id?: string;
  last_activity: Date;
}

export type ChatRoomType = 'group' | 'direct' | 'public' | 'private';

export interface ChatRoomSettings {
  allowFileSharing: boolean;
  allowMentions: boolean;
  muteNotifications: boolean;
}

// Request types
export interface CreateChatRoomRequest {
  name: string;
  description?: string;
  type?: ChatRoomType;
  is_private?: boolean;
  created_by: string;
  participants?: string[];
  avatar?: string;
  settings?: ChatRoomSettings;
}

export interface UpdateChatRoomRequest {
  name?: string;
  description?: string;
  type?: ChatRoomType;
  is_private?: boolean;
  participants?: string[];
  avatar?: string;
  settings?: ChatRoomSettings;
}

export interface CreateMessageRequest {
  content: string;
  type?: MessageType;
  room_id: string;
  sender_id: string;
  reply_to_id?: string;
  attachments?: any[];
  mentions?: string[];
}

// Legacy ChatMessage interface for ChatService compatibility
export interface LegacyChatMessage extends BaseEntity {
  content: string;
  type: MessageType;
  room_id: string;
  sender_id: string;
  reply_to_id?: string;
  attachments: any[];
  mentions: string[];
  reactions: Record<string, string[]>; // emoji -> user IDs array
  is_edited: boolean;
  is_deleted: boolean;
}

// Canal de Chat
export interface ChatChannel extends BaseEntity {
  name: string;
  description?: string;
  type: ChannelType;
  privacy: ChannelPrivacy;
  owner_id: string;
  members: string[]; // User IDs
  admins: string[]; // User IDs
  settings: ChannelSettings;
  last_message_id?: string;
  last_activity: Date;
  message_count: number;
  is_archived: boolean;
  avatar?: string;
}

export enum ChannelType {
  TEXT = 'text',
  VOICE = 'voice',
  VIDEO = 'video',
  DIRECT = 'direct',
  GROUP = 'group',
}

export enum ChannelPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  DIRECT = 'direct',
}

export interface ChannelSettings {
  allow_file_upload: boolean;
  allow_emoji_reactions: boolean;
  allow_thread_replies: boolean;
  retention_days?: number;
  slow_mode_seconds?: number;
  max_members?: number;
}

// Mensaje
export interface ChatMessage extends BaseEntity {
  channel_id: string;
  user_id: string;
  content: string;
  type: MessageType;
  thread_id?: string; // Para respuestas en hilo
  reply_to_id?: string; // Para respuestas directas
  mentions?: string[]; // User IDs mencionados
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  is_edited: boolean;
  edited_at?: Date;
  is_deleted: boolean;
  deleted_at?: Date;
  is_pinned: boolean;
  pinned_by?: string;
  pinned_at?: Date;
}

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  SYSTEM = 'system',
  CALL_START = 'call_start',
  CALL_END = 'call_end',
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
}

export interface MessageReaction {
  emoji: string;
  users: string[]; // User IDs que reaccionaron
  count: number;
}

// Miembro del Canal
export interface ChannelMember extends BaseEntity {
  channel_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: Date;
  last_read_message_id?: string;
  last_read_at?: Date;
  notification_settings: NotificationSettings;
  is_muted: boolean;
  muted_until?: Date;
}

export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export interface NotificationSettings {
  mention_notifications: boolean;
  message_notifications: boolean;
  file_notifications: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
}

// Llamada de Voz/Video
export interface Call extends BaseEntity {
  channel_id: string;
  initiator_id: string;
  type: CallType;
  status: CallStatus;
  participants: CallParticipant[];
  started_at?: Date;
  ended_at?: Date;
  duration?: number; // en segundos
  recording_url?: string;
  is_recorded: boolean;
}

export enum CallType {
  VOICE = 'voice',
  VIDEO = 'video',
  SCREEN_SHARE = 'screen_share',
}

export enum CallStatus {
  INITIATING = 'initiating',
  RINGING = 'ringing',
  IN_PROGRESS = 'in_progress',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export interface CallParticipant {
  user_id: string;
  joined_at?: Date;
  left_at?: Date;
  status: ParticipantStatus;
  is_muted: boolean;
  is_video_enabled: boolean;
  is_screen_sharing: boolean;
}

export enum ParticipantStatus {
  INVITED = 'invited',
  JOINED = 'joined',
  LEFT = 'left',
  DECLINED = 'declined',
}

// Bot/Integración
export interface Bot extends BaseEntity {
  name: string;
  description?: string;
  avatar?: string;
  webhook_url?: string;
  commands: BotCommand[];
  channels: string[]; // Channel IDs donde está activo
  owner_id: string;
  is_active: boolean;
  settings: BotSettings;
}

export interface BotCommand {
  trigger: string;
  description: string;
  usage: string;
  response_type: BotResponseType;
  response_data: any;
}

export enum BotResponseType {
  TEXT = 'text',
  EMBED = 'embed',
  FILE = 'file',
  API_CALL = 'api_call',
}

export interface BotSettings {
  respond_to_mentions: boolean;
  respond_to_direct_messages: boolean;
  log_interactions: boolean;
  rate_limit_per_minute: number;
}

// Archivo compartido
export interface SharedFile extends BaseEntity {
  name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  channel_id: string;
  message_id?: string;
  uploaded_by: string;
  download_count: number;
  is_public: boolean;
  expires_at?: Date;
  thumbnail_url?: string;
}

// Presencia del Usuario
export interface UserPresence extends BaseEntity {
  user_id: string;
  status: PresenceStatus;
  custom_status?: string;
  last_seen: Date;
  is_online: boolean;
  current_channel_id?: string;
}

export enum PresenceStatus {
  ONLINE = 'online',
  AWAY = 'away',
  BUSY = 'busy',
  INVISIBLE = 'invisible',
  OFFLINE = 'offline',
}
