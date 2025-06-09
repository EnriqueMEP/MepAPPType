import { db } from '../config/database';
import { User, UserRole, UserStatus } from '../types/common';
import { AuthUtils } from '../utils/auth';
import { IdGenerator, DateUtils } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  private static readonly tableName = 'users';

  static async findById(id: string): Promise<User | null> {
    const user = await db(this.tableName)
      .where({ id })
      .first();
    
    return user || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await db(this.tableName)
      .where({ email: email.toLowerCase() })
      .first();
    
    return user || null;
  }

  static async create(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role?: UserRole;
    status?: UserStatus;
  }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 409);
    }

    const hashedPassword = await AuthUtils.hashPassword(userData.password);
    const now = DateUtils.now();

    const user: Partial<User> = {
      id: IdGenerator.generate(),
      email: userData.email.toLowerCase(),
      password_hash: hashedPassword,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      role: userData.role || UserRole.EMPLOYEE,
      status: userData.status || UserStatus.ACTIVE,
      email_verified: false,
      created_at: now,
      updated_at: now,
    };

    const [createdUser] = await db(this.tableName)
      .insert(user)
      .returning('*');

    return createdUser;
  }

  static async update(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const updateData = {
      ...updates,
      updated_at: DateUtils.now(),
    };

    // Si se actualiza el email, verificar que no esté en uso
    if (updates.email) {
      const existingUser = await this.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError('El email ya está registrado', 409);
      }
      updateData.email = updates.email.toLowerCase();
    }

    const [updatedUser] = await db(this.tableName)
      .where({ id })
      .update(updateData)
      .returning('*');

    return updatedUser;
  }

  static async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    await db(this.tableName)
      .where({ id })
      .del();
  }

  static async list(options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sort = 'created_at',
      order = 'desc',
    } = options;

    let query = db(this.tableName);

    // Filtros
    if (search) {
      query = query.where(function() {
        this.where('first_name', 'ilike', `%${search}%`)
          .orWhere('last_name', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`);
      });
    }

    if (role) {
      query = query.where({ role });
    }

    if (status) {
      query = query.where({ status });
    }

    // Contar total
    const totalQuery = query.clone().count('* as count');
    const [{ count }] = await totalQuery;
    const total = parseInt(count as string);

    // Aplicar paginación y ordenamiento
    const users = await query
      .orderBy(sort, order)
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

    return { users, total };
  }

  static async authenticate(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('Cuenta inactiva', 401);
    }

    const isValidPassword = await AuthUtils.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Actualizar último login
    await this.update(user.id, {
      last_login: DateUtils.now(),
    });

    return user;
  }

  static async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const isValidPassword = await AuthUtils.comparePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Contraseña actual incorrecta', 400);
    }

    const hashedPassword = await AuthUtils.hashPassword(newPassword);
    await this.update(id, {
      password_hash: hashedPassword,
    });
  }
  static async resetPassword(email: string): Promise<{ user: User; resetToken: string } | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      // No revelar si el email existe o no por seguridad
      return null;
    }

    const resetToken = IdGenerator.generate();
    const resetExpires = DateUtils.addHours(DateUtils.now(), 1); // 1 hora

    await this.update(user.id, {
      reset_password_token: resetToken,
      reset_password_expires: resetExpires,
    });

    return { user, resetToken };
  }

  static async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    const user = await db(this.tableName)
      .where({ reset_password_token: token })
      .first();

    if (!user) {
      throw new AppError('Token inválido', 400);
    }

    if (!user.reset_password_expires || DateUtils.isExpired(user.reset_password_expires)) {
      throw new AppError('Token expirado', 400);
    }

    const hashedPassword = await AuthUtils.hashPassword(newPassword);
    await this.update(user.id, {
      password_hash: hashedPassword,
      reset_password_token: undefined,
      reset_password_expires: undefined,
    });
  }

  static async verifyEmail(token: string): Promise<void> {
    const user = await db(this.tableName)
      .where({ email_verification_token: token })
      .first();

    if (!user) {
      throw new AppError('Token inválido', 400);
    }

    await this.update(user.id, {
      email_verified: true,
      email_verified_at: DateUtils.now(),
      email_verification_token: undefined,
    });
  }
}

export default UserService;
