// Script para crear usuario administrador
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    // Hashear la contraseña
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('🔑 Credenciales de Admin generadas:');
    console.log('Email: admin@mep.com');
    console.log('Password: admin123');
    console.log('Hash:', hashedPassword);
    
    // SQL para insertar el usuario
    const sql = `
INSERT INTO users (
  id, 
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  status, 
  email_verified, 
  created_at, 
  updated_at
) VALUES (
  'admin-001',
  'admin@mep.com',
  '${hashedPassword}',
  'Admin',
  'Sistema',
  'super_admin',
  'active',
  true,
  NOW(),
  NOW()
);`;
    
    console.log('\n📝 SQL para insertar admin:');
    console.log(sql);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdmin();