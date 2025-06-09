import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Tabla de empleados
  await knex.schema.createTable('employees', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('employee_id').unique().notNullable();
    table.uuid('department_id').references('id').inTable('departments').onDelete('SET NULL');
    table.uuid('position_id').references('id').inTable('positions').onDelete('SET NULL');
    table.uuid('manager_id').references('id').inTable('users').onDelete('SET NULL');
    table.date('hire_date').notNullable();
    table.enum('employment_type', ['full_time', 'part_time', 'contract', 'internship', 'temporary']).defaultTo('full_time');
    table.enum('work_location', ['office', 'remote', 'hybrid']).defaultTo('office');
    table.decimal('salary', 15, 2);
    table.string('currency', 3).defaultTo('USD');
    table.enum('status', ['active', 'inactive', 'terminated', 'on_leave']).defaultTo('active');
    table.string('emergency_contact_name');
    table.string('emergency_contact_phone');
    table.text('address');
    table.string('city');
    table.string('country');
    table.string('postal_code');
    table.date('birth_date');
    table.string('national_id');
    table.string('tax_id');
    table.string('bank_account');
    table.text('notes');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['employee_id']);
    table.index(['department_id']);
    table.index(['manager_id']);
    table.index(['status']);
  });

  // Tabla de solicitudes de licencia
  await knex.schema.createTable('leave_requests', (table) => {
    table.uuid('id').primary();
    table.uuid('employee_id').references('id').inTable('employees').onDelete('CASCADE');
    table.enum('type', ['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'jury_duty', 'military', 'other']).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.integer('days_requested').notNullable();
    table.text('reason');
    table.enum('status', ['pending', 'approved', 'rejected', 'cancelled']).defaultTo('pending');
    table.uuid('approved_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('approved_at');
    table.text('comments');
    table.json('attachments');
    table.timestamps(true, true);
    
    table.index(['employee_id']);
    table.index(['status']);
    table.index(['start_date']);
    table.index(['end_date']);
  });

  // Tabla de asistencia
  await knex.schema.createTable('attendance', (table) => {
    table.uuid('id').primary();
    table.uuid('employee_id').references('id').inTable('employees').onDelete('CASCADE');
    table.date('date').notNullable();
    table.timestamp('clock_in');
    table.timestamp('clock_out');
    table.timestamp('break_start');
    table.timestamp('break_end');
    table.decimal('total_hours', 8, 2);
    table.decimal('overtime_hours', 8, 2);
    table.enum('status', ['present', 'absent', 'late', 'half_day', 'leave', 'holiday']).defaultTo('present');
    table.string('location');
    table.string('ip_address');
    table.text('notes');
    table.timestamps(true, true);
    
    table.index(['employee_id']);
    table.index(['date']);
    table.index(['status']);
    table.unique(['employee_id', 'date']);
  });

  console.log('✅ Migración 002_create_rrhh_tables completada');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('attendance');
  await knex.schema.dropTableIfExists('leave_requests');
  await knex.schema.dropTableIfExists('employees');
}
