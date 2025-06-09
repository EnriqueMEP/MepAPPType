import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabla de clientes
  await knex.schema.createTable('customers', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone');
    table.text('address');
    table.string('city');
    table.string('country');
    table.string('postal_code');
    table.string('tax_id');
    table.string('website');
    table.string('industry');
    table.decimal('annual_revenue', 15, 2);
    table.integer('employees_count');
    table.enum('status', ['active', 'inactive', 'prospect', 'lost']).defaultTo('active');
    table.enum('source', ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'trade_show', 'other']).defaultTo('other');
    table.uuid('assigned_to').references('id').inTable('users').onDelete('SET NULL');
    table.text('notes');
    table.timestamp('last_contact');
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['email']);
    table.index(['status']);
    table.index(['assigned_to']);
  });

  // Tabla de leads
  await knex.schema.createTable('leads', (table) => {
    table.uuid('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.string('phone');
    table.string('company');
    table.string('job_title');
    table.enum('source', ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'trade_show', 'other']).defaultTo('other');
    table.enum('status', ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).defaultTo('new');
    table.enum('stage', ['awareness', 'interest', 'consideration', 'decision']).defaultTo('awareness');
    table.decimal('value', 15, 2);
    table.integer('probability').defaultTo(0);
    table.uuid('assigned_to').references('id').inTable('users').onDelete('SET NULL');
    table.text('notes');
    table.timestamp('last_contact');
    table.date('expected_close_date');
    table.timestamps(true, true);
    
    table.index(['first_name', 'last_name']);
    table.index(['email']);
    table.index(['status']);
    table.index(['stage']);
    table.index(['assigned_to']);
  });

  // Tabla de oportunidades
  await knex.schema.createTable('opportunities', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.uuid('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    table.uuid('lead_id').references('id').inTable('leads').onDelete('SET NULL');
    table.decimal('value', 15, 2).notNullable();
    table.integer('probability').defaultTo(0);
    table.enum('stage', ['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).defaultTo('prospecting');
    table.enum('status', ['open', 'won', 'lost']).defaultTo('open');
    table.uuid('assigned_to').references('id').inTable('users').onDelete('SET NULL');
    table.date('expected_close_date');
    table.date('actual_close_date');
    table.text('description');
    table.text('notes');
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['customer_id']);
    table.index(['stage']);
    table.index(['status']);
    table.index(['assigned_to']);
  });

  // Tabla de actividades
  await knex.schema.createTable('activities', (table) => {
    table.uuid('id').primary();
    table.enum('type', ['call', 'email', 'meeting', 'task', 'note', 'demo', 'proposal', 'follow_up']).notNullable();
    table.string('subject').notNullable();
    table.text('description');
    table.timestamp('date').notNullable();
    table.integer('duration'); // en minutos
    table.enum('status', ['pending', 'in_progress', 'completed', 'cancelled']).defaultTo('pending');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    table.uuid('assigned_to').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('customer_id').references('id').inTable('customers').onDelete('CASCADE');
    table.uuid('lead_id').references('id').inTable('leads').onDelete('CASCADE');
    table.uuid('opportunity_id').references('id').inTable('opportunities').onDelete('CASCADE');
    table.text('notes');
    table.timestamps(true, true);
    
    table.index(['type']);
    table.index(['status']);
    table.index(['assigned_to']);
    table.index(['customer_id']);
    table.index(['date']);
  });

  console.log('✅ Migración 003_create_crm_tables completada');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('activities');
  await knex.schema.dropTableIfExists('opportunities');
  await knex.schema.dropTableIfExists('leads');
  await knex.schema.dropTableIfExists('customers');
}
