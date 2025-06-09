import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabla de proyectos
  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.enum('status', ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']).defaultTo('planning');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.date('start_date');
    table.date('due_date');
    table.date('completed_date');
    table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE');
    table.json('team_members'); // Array de User IDs
    table.uuid('customer_id').references('id').inTable('customers').onDelete('SET NULL');
    table.decimal('budget', 15, 2);
    table.string('currency', 3).defaultTo('USD');
    table.integer('progress').defaultTo(0); // 0-100
    table.json('tags');
    table.string('color');
    table.boolean('is_archived').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['status']);
    table.index(['owner_id']);
    table.index(['customer_id']);
  });

  // Tabla de tableros
  await knex.schema.createTable('boards', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.uuid('owner_id').references('id').inTable('users').onDelete('CASCADE');
    table.json('team_members'); // Array de User IDs
    table.json('columns'); // Array de columnas del tablero
    table.json('settings'); // Configuraciones del tablero
    table.boolean('is_template').defaultTo(false);
    table.boolean('is_archived').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['project_id']);
    table.index(['owner_id']);
  });

  // Tabla de tareas
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.enum('status', ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled']).defaultTo('todo');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.uuid('board_id').references('id').inTable('boards').onDelete('CASCADE');
    table.uuid('assigned_to').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE');
    table.date('start_date');
    table.date('due_date');
    table.date('completed_date');
    table.decimal('estimated_hours', 8, 2);
    table.decimal('actual_hours', 8, 2);
    table.integer('progress').defaultTo(0); // 0-100
    table.json('tags');
    table.json('dependencies'); // Array de Task IDs
    table.json('attachments'); // Array de archivos
    table.json('checklist'); // Array de items del checklist
    table.boolean('is_recurring').defaultTo(false);
    table.json('recurrence_pattern');
    table.uuid('parent_task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index(['title']);
    table.index(['status']);
    table.index(['project_id']);
    table.index(['assigned_to']);
    table.index(['created_by']);
    table.index(['due_date']);
  });

  // Tabla de comentarios de tareas
  await knex.schema.createTable('task_comments', (table) => {
    table.uuid('id').primary();
    table.uuid('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.json('mentions'); // Array de User IDs mencionados
    table.json('attachments'); // Array de archivos
    table.uuid('parent_id').references('id').inTable('task_comments').onDelete('CASCADE'); // Para respuestas
    table.timestamps(true, true);
    
    table.index(['task_id']);
    table.index(['user_id']);
    table.index(['parent_id']);
  });

  // Tabla de entradas de tiempo
  await knex.schema.createTable('time_entries', (table) => {
    table.uuid('id').primary();
    table.uuid('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time');
    table.integer('duration').notNullable(); // en minutos
    table.text('description');
    table.boolean('is_billable').defaultTo(false);
    table.decimal('hourly_rate', 10, 2);
    table.decimal('total_amount', 15, 2);
    table.enum('status', ['running', 'stopped', 'approved', 'rejected']).defaultTo('stopped');
    table.timestamps(true, true);
    
    table.index(['task_id']);
    table.index(['user_id']);
    table.index(['start_time']);
    table.index(['status']);
  });

  console.log('✅ Migración 004_create_task_tables completada');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('time_entries');
  await knex.schema.dropTableIfExists('task_comments');
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('boards');
  await knex.schema.dropTableIfExists('projects');
}
