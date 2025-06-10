import knex from 'knex';
import path from 'path';

// Configuración temporal con SQLite para desarrollo sin PostgreSQL
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../../temp_database.sqlite')
  },
  useNullAsDefault: true,
  migrations: {
    directory: './database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './database/seeds',
    extension: 'ts',
  },
  pool: {
    min: 1,
    max: 1,
  },
};

export const db = knex(knexConfig);

// Función para inicializar la base de datos temporal
export async function initializeDatabase() {
  try {
    // Crear tabla de usuarios básica para pruebas
    const hasUsersTable = await db.schema.hasTable('users');
    if (!hasUsersTable) {
      await db.schema.createTable('users', (table) => {
        table.string('id').primary();
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone').nullable();
        table.string('role').notNullable().defaultTo('employee');
        table.string('status').notNullable().defaultTo('active');
        table.boolean('email_verified').defaultTo(false);
        table.timestamp('email_verified_at').nullable();
        table.timestamp('last_login').nullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
      });
      
      console.log('✅ Tabla de usuarios creada');
    }
    
    // Insertar usuario administrador temporal
    const adminExists = await db('users').where('email', 'admin@mep.com').first();
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await db('users').insert({
        id: 'admin-temp-001',
        email: 'admin@mep.com',
        password_hash: hashedPassword,
        first_name: 'Admin',
        last_name: 'Temporal',
        role: 'super_admin',
        status: 'active',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log('✅ Usuario administrador temporal creado');
      console.log('📧 Email: admin@mep.com');
      console.log('🔑 Password: admin123');
    }
    
    console.log('🗄️ Base de datos SQLite temporal inicializada');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos temporal:', error);
  }
}
