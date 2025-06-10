const { v4: uuidv4 } = require('uuid');

exports.up = async function(knex) {
  // Tabla de usuarios
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('avatar');
    table.string('phone');
    table.enu('role', ['super_admin', 'admin', 'manager', 'employee', 'client']).defaultTo('employee');
    table.enu('status', ['active', 'inactive', 'suspended', 'pending']).defaultTo('active');
    table.timestamp('last_login');
    table.boolean('email_verified').defaultTo(false);
    table.timestamp('email_verified_at');
    table.string('email_verification_token');
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.timestamps(true, true);
  });

  // Tabla de departamentos
  await knex.schema.createTable('departments', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.uuid('manager_id');
    table.decimal('budget', 12, 2);
    table.string('location');
    table.enu('status', ['active', 'inactive']).defaultTo('active');
    table.timestamps(true, true);

    table.foreign('manager_id').references('id').inTable('users').onDelete('SET NULL');
  });

  // Tabla de posiciones/cargos
  await knex.schema.createTable('positions', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.uuid('department_id').notNullable();
    table.enu('level', ['junior', 'mid', 'senior', 'lead', 'manager']).defaultTo('junior');
    table.decimal('min_salary', 10, 2);
    table.decimal('max_salary', 10, 2);
    table.text('requirements');
    table.text('responsibilities');
    table.enu('status', ['active', 'inactive', 'filled']).defaultTo('active');
    table.timestamps(true, true);

    table.foreign('department_id').references('id').inTable('departments').onDelete('CASCADE');
  });

  console.log('✅ Tablas base creadas: users, departments, positions');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('positions');
  await knex.schema.dropTableIfExists('departments');
  await knex.schema.dropTableIfExists('users');
};
