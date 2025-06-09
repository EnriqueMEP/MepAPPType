import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('uploaded_files', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('original_name').notNullable();
    table.string('filename').notNullable().unique();
    table.string('mimetype').notNullable();
    table.integer('size').notNullable();
    table.string('path').notNullable();
    table.uuid('uploaded_by').notNullable();
    table.string('module').defaultTo('documents');
    table.string('entity_id').nullable();
    table.string('entity_type').nullable();
    table.timestamp('uploaded_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Índices
    table.index(['uploaded_by']);
    table.index(['module']);
    table.index(['entity_type', 'entity_id']);
    table.index(['uploaded_at']);

    // Claves foráneas
    table.foreign('uploaded_by').references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('uploaded_files');
}
