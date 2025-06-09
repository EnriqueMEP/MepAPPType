import { Knex } from 'knex';
import { UserRole, UserStatus } from '../../types/common';
import { AuthUtils } from '../../utils/auth';
import { IdGenerator, DateUtils } from '../../utils/helpers';

export async function seed(knex: Knex): Promise<void> {
  // Limpiar tablas existentes
  await knex('users').del();
  await knex('departments').del();
  await knex('positions').del();

  const now = DateUtils.now();

  // Crear usuarios de prueba
  const users = [
    {
      id: IdGenerator.generate(),
      email: 'admin@mep-projects.com',
      password_hash: await AuthUtils.hashPassword('admin123456'),
      first_name: 'Administrador',
      last_name: 'Sistema',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: IdGenerator.generate(),
      email: 'manager@mep-projects.com',
      password_hash: await AuthUtils.hashPassword('manager123456'),
      first_name: 'María',
      last_name: 'González',
      phone: '+1234567890',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: IdGenerator.generate(),
      email: 'employee@mep-projects.com',
      password_hash: await AuthUtils.hashPassword('employee123456'),
      first_name: 'Juan',
      last_name: 'Pérez',
      phone: '+0987654321',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      email_verified: true,
      email_verified_at: now,
      created_at: now,
      updated_at: now,
    },
    {
      id: IdGenerator.generate(),
      email: 'client@mep-projects.com',
      password_hash: await AuthUtils.hashPassword('client123456'),
      first_name: 'Ana',
      last_name: 'López',
      phone: '+1122334455',
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
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
      id: IdGenerator.generate(),
      name: 'Tecnología',
      description: 'Departamento de desarrollo y tecnología',
      manager_id: users[1].id, // María González
      budget: 500000,
      location: 'Oficina Principal',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: IdGenerator.generate(),
      name: 'Recursos Humanos',
      description: 'Gestión del talento humano',
      manager_id: users[1].id, // María González
      budget: 200000,
      location: 'Oficina Principal',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: IdGenerator.generate(),
      name: 'Ventas',
      description: 'Departamento comercial y ventas',
      manager_id: users[1].id, // María González
      budget: 300000,
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
      id: IdGenerator.generate(),
      title: 'Desarrollador Full Stack',
      description: 'Desarrollo de aplicaciones web y móviles',
      department_id: departments[0].id, // Tecnología
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
      id: IdGenerator.generate(),
      title: 'Especialista en RRHH',
      description: 'Gestión de recursos humanos y nómina',
      department_id: departments[1].id, // RRHH
      level: 'senior',
      min_salary: 45000,
      max_salary: 65000,
      requirements: 'Título en RRHH, 5+ años experiencia',
      responsibilities: 'Reclutamiento, nómina, evaluaciones de desempeño',
      status: 'active',
      created_at: now,
      updated_at: now,
    },
    {
      id: IdGenerator.generate(),
      title: 'Ejecutivo de Ventas',
      description: 'Ventas B2B y gestión de clientes',
      department_id: departments[2].id, // Ventas
      level: 'junior',
      min_salary: 35000,
      max_salary: 55000,
      requirements: 'Experiencia en ventas, CRM',
      responsibilities: 'Prospección, cierre de ventas, atención al cliente',
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
}

export async function down(knex: Knex): Promise<void> {
  await knex('positions').del();
  await knex('departments').del();
  await knex('users').del();
}
