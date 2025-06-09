import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabla de canales de chat
  await knex.schema.createTable('chat_channels', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.enum('type', ['text', 'voice', 'video', 'direct', 'group']).defaultTo('text');
    table.enum('privacy', ['public', 'private', 'direct']).defaultTo('public');
    table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE');
    table.json('members'); // Array de User IDs
    table.json('admins'); // Array de User IDs
    table.json('settings'); // Configuraciones del canal
    table.uuid('last_message_id');
    table.timestamp('last_activity').defaultTo(knex.fn.now());
    table.integer('message_count').defaultTo(0);
    table.boolean('is_archived').defaultTo(false);
    table.string('avatar');
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['type']);
    table.index(['privacy']);
    table.index(['owner_id']);
  });

  // Tabla de mensajes de chat
  await knex.schema.createTable('chat_messages', (table) => {
    table.uuid('id').primary();
    table.uuid('channel_id').references('id').inTable('chat_channels').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.enum('type', ['text', 'file', 'image', 'video', 'audio', 'system', 'call_start', 'call_end']).defaultTo('text');
    table.uuid('thread_id'); // Para respuestas en hilo
    table.uuid('reply_to_id').references('id').inTable('chat_messages').onDelete('SET NULL'); // Para respuestas directas
    table.json('mentions'); // Array de User IDs mencionados
    table.json('attachments'); // Array de archivos
    table.json('reactions'); // Array de reacciones
    table.boolean('is_edited').defaultTo(false);
    table.timestamp('edited_at');
    table.boolean('is_deleted').defaultTo(false);
    table.timestamp('deleted_at');
    table.boolean('is_pinned').defaultTo(false);
    table.uuid('pinned_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('pinned_at');
    table.timestamps(true, true);
    
    table.index(['channel_id']);
    table.index(['user_id']);
    table.index(['thread_id']);
    table.index(['created_at']);
  });

  // Tabla de miembros de canal
  await knex.schema.createTable('channel_members', (table) => {
    table.uuid('id').primary();
    table.uuid('channel_id').references('id').inTable('chat_channels').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('role', ['owner', 'admin', 'member', 'guest']).defaultTo('member');
    table.enum('status', ['active', 'inactive', 'banned']).defaultTo('active');
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.uuid('last_read_message_id');
    table.timestamp('last_read_at');
    table.json('notification_settings');
    table.boolean('is_muted').defaultTo(false);
    table.timestamp('muted_until');
    table.timestamps(true, true);
    
    table.index(['channel_id']);
    table.index(['user_id']);
    table.unique(['channel_id', 'user_id']);
  });

  // Tabla de llamadas
  await knex.schema.createTable('calls', (table) => {
    table.uuid('id').primary();
    table.uuid('channel_id').references('id').inTable('chat_channels').onDelete('CASCADE');
    table.uuid('initiator_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('type', ['voice', 'video', 'screen_share']).defaultTo('voice');
    table.enum('status', ['initiating', 'ringing', 'in_progress', 'ended', 'cancelled', 'failed']).defaultTo('initiating');
    table.json('participants'); // Array de participantes con su estado
    table.timestamp('started_at');
    table.timestamp('ended_at');
    table.integer('duration'); // en segundos
    table.string('recording_url');
    table.boolean('is_recorded').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['channel_id']);
    table.index(['initiator_id']);
    table.index(['status']);
  });

  // Tabla de presencia de usuarios
  await knex.schema.createTable('user_presence', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique();
    table.enum('status', ['online', 'away', 'busy', 'invisible', 'offline']).defaultTo('offline');
    table.string('custom_status');
    table.timestamp('last_seen').defaultTo(knex.fn.now());
    table.boolean('is_online').defaultTo(false);
    table.uuid('current_channel_id').references('id').inTable('chat_channels').onDelete('SET NULL');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['status']);
  });

  console.log('✅ Migración 005_create_chat_tables completada');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_presence');
  await knex.schema.dropTableIfExists('calls');
  await knex.schema.dropTableIfExists('channel_members');
  await knex.schema.dropTableIfExists('chat_messages');
  await knex.schema.dropTableIfExists('chat_channels');
}
