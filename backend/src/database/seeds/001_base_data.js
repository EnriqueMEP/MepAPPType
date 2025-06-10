const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // Limpiar tablas existentes
  await knex('users').del();
  await knex('departments').del();
  await knex('positions').del();

  const now = new Date();

  // Generar UUIDs
  const adminId = uuidv4();
  const managerId = uuidv4();
  const employeeId = uuidv4();
  const clientId = uuidv4();
  const deptTechId = uuidv4();
  const deptHrId = uuidv4();

  // Hashear contraseñas
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const managerPassword = await bcrypt.hash('manager123456', 12);
  const employeePassword = await bcrypt.hash('employee123456', 12);
  const clientPassword = await bcrypt.hash('client123456', 12);
  // Crear usuarios de prueba
  const users = [
    {
      id: adminId,
      email: 'admin@mep-projects.com',
      password_hash: adminPassword,
      first_name: 'Administrador',
      last_name: 'Sistema',
      role: 'super_admin',
      status: 'active',
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: managerId,
      email: 'manager@mep-projects.com',
      password_hash: managerPassword,
      first_name: 'María',
      last_name: 'González',
      phone: '+1234567890',
      role: 'manager',
      status: 'active',
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: employeeId,
      email: 'employee@mep-projects.com',
      password_hash: employeePassword,
      first_name: 'Juan',
      last_name: 'Pérez',
      phone: '+0987654321',
      role: 'employee',
      status: 'active',
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: clientId,
      email: 'client@mep-projects.com',
      password_hash: clientPassword,
      first_name: 'Ana',
      last_name: 'López',
      phone: '+1122334455',
      role: 'client',
      status: 'active',
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
  ];

  await knex('users').insert(users);
  // Crear departamentos de prueba
  const departments = [
    {
      id: deptTechId,
      name: 'Tecnología',
      description: 'Departamento de desarrollo y tecnología',
      manager_id: managerId,
      budget: 500000,
      location: 'Oficina Principal',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: deptHrId,
      name: 'Recursos Humanos',
      description: 'Gestión de personal y talento humano',
      manager_id: managerId,
      budget: 200000,
      location: 'Oficina Principal',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
  ];

  await knex('departments').insert(departments);
  // Crear posiciones de prueba
  const positions = [
    {
      id: uuidv4(),
      title: 'Desarrollador Full Stack',
      description: 'Desarrollo de aplicaciones web y móviles',
      department_id: deptTechId,
      level: 'mid',
      min_salary: 50000,
      max_salary: 80000,
      requirements: 'React, Node.js, PostgreSQL, 3+ años experiencia',
      responsibilities: 'Desarrollo frontend y backend, APIs REST, bases de datos',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: uuidv4(),
      title: 'Especialista en RRHH',
      description: 'Gestión de recursos humanos y nómina',
      department_id: deptHrId,
      level: 'senior',
      min_salary: 45000,
      max_salary: 65000,
      requirements: 'Título en RRHH, 5+ años experiencia',
      responsibilities: 'Reclutamiento, nómina, evaluaciones de desempeño',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
  ];

  await knex('positions').insert(positions);

  console.log(`
✅ Seeds ejecutados exitosamente!

👥 Usuarios creados:
   • Admin: admin@mep-projects.com / admin123456
   • Manager: manager@mep-projects.com / manager123456  
   • Employee: employee@mep-projects.com / employee123456
   • Client: client@mep-projects.com / client123456

🏢 Departamentos: ${departments.length}
💼 Posiciones: ${positions.length}
  `);
};

exports.down = async function(knex) {
  await knex('positions').del();
  await knex('departments').del();
  await knex('users').del();
};
