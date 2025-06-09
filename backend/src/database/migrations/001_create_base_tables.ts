import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabla de usuarios
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('avatar');
    table.string('phone');
    table.enum('role', ['super_admin', 'admin', 'manager', 'employee', 'client']).defaultTo('employee');
    table.enum('status', ['active', 'inactive', 'suspended', 'pending']).defaultTo('active');
    table.timestamp('last_login');
    table.boolean('email_verified').defaultTo(false);
    table.timestamp('email_verified_at');
    table.string('email_verification_token');
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
  });

  // Tabla de departamentos
  await knex.schema.createTable('departments', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.uuid('manager_id').references('id').inTable('users').onDelete('SET NULL');
    table.decimal('budget', 15, 2);
    table.string('location');
    table.enum('status', ['active', 'inactive']).defaultTo('active');
    table.timestamps(true, true);
    
    table.index(['name']);
    table.index(['status']);
  });

  // Tabla de posiciones
  await knex.schema.createTable('positions', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.uuid('department_id').references('id').inTable('departments').onDelete('CASCADE');
    table.enum('level', ['intern', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive']).defaultTo('junior');
    table.decimal('min_salary', 15, 2);
    table.decimal('max_salary', 15, 2);
    table.text('requirements');
    table.text('responsibilities');
    table.enum('status', ['active', 'inactive']).defaultTo('active');
    table.timestamps(true, true);
    
    table.index(['title']);
    table.index(['department_id']);
    table.index(['level']);
    table.index(['status']);
  });

  console.log('✅ Migración 001_create_base_tables completada');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('positions');
  await knex.schema.dropTableIfExists('departments');
  await knex.schema.dropTableIfExists('users');
}
