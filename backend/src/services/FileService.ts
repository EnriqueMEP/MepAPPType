import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import knex from '../config/database';

export interface UploadedFile {
  id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedBy: string;
  uploadedAt: Date;
  module?: string;
  entityId?: string;
  entityType?: string;
}

class FileService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Crear subdirectorios por módulo
    const modules = ['avatars', 'documents', 'images', 'crm', 'rrhh', 'tasks', 'chat'];
    modules.forEach(module => {
      const moduleDir = path.join(this.uploadDir, module);
      if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
      }
    });
  }

  // Configuración de multer con validaciones
  public getStorageConfig() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const module = req.body.module || 'documents';
        const destPath = path.join(this.uploadDir, module);
        cb(null, destPath);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname);
        const filename = `${uniqueId}${extension}`;
        cb(null, filename);
      }
    });
  }

  // Filtro de archivos con validaciones de tipo y tamaño
  public fileFilter(req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // Tipos de archivo permitidos
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
    }
  }

  // Configuración principal de multer
  public getMulterConfig() {
    return multer({
      storage: this.getStorageConfig(),
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB límite
        files: 5 // Máximo 5 archivos por vez
      }
    });
  }

  // Guardar información del archivo en la base de datos
  async saveFileRecord(fileData: Omit<UploadedFile, 'id' | 'uploadedAt'>): Promise<UploadedFile> {
    const [file] = await knex('uploaded_files')
      .insert({
        id: uuidv4(),
        original_name: fileData.originalName,
        filename: fileData.filename,
        mimetype: fileData.mimetype,
        size: fileData.size,
        path: fileData.path,
        uploaded_by: fileData.uploadedBy,
        module: fileData.module,
        entity_id: fileData.entityId,
        entity_type: fileData.entityType,
        uploaded_at: new Date()
      })
      .returning('*');

    return this.mapFileRecord(file);
  }

  // Obtener archivos por entidad
  async getFilesByEntity(entityType: string, entityId: string): Promise<UploadedFile[]> {
    const files = await knex('uploaded_files')
      .where({ entity_type: entityType, entity_id: entityId })
      .orderBy('uploaded_at', 'desc');

    return files.map(this.mapFileRecord);
  }

  // Obtener archivos por módulo
  async getFilesByModule(module: string, userId?: string): Promise<UploadedFile[]> {
    const query = knex('uploaded_files').where({ module });
    
    if (userId) {
      query.where({ uploaded_by: userId });
    }

    const files = await query.orderBy('uploaded_at', 'desc');
    return files.map(this.mapFileRecord);
  }

  // Obtener archivo por ID
  async getFileById(id: string): Promise<UploadedFile | null> {
    const file = await knex('uploaded_files').where({ id }).first();
    return file ? this.mapFileRecord(file) : null;
  }

  // Eliminar archivo
  async deleteFile(id: string, userId: string): Promise<boolean> {
    const file = await this.getFileById(id);
    if (!file) return false;

    // Verificar permisos (solo el propietario o admin puede eliminar)
    const user = await knex('users').where({ id: userId }).first();
    if (file.uploadedBy !== userId && user?.role !== 'admin') {
      throw new Error('No tienes permisos para eliminar este archivo');
    }

    // Eliminar archivo físico
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error('Error eliminando archivo físico:', error);
    }

    // Eliminar registro de la base de datos
    await knex('uploaded_files').where({ id }).del();
    return true;
  }

  // Obtener URL de descarga
  getDownloadUrl(filename: string, module: string): string {
    return `/api/files/download/${module}/${filename}`;
  }

  // Validar si el archivo existe físicamente
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  // Obtener estadísticas de archivos
  async getFileStats(userId?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<string, number>;
    filesByModule: Record<string, number>;
  }> {
    const query = knex('uploaded_files');
    if (userId) {
      query.where({ uploaded_by: userId });
    }

    const files = await query.select('mimetype', 'module', 'size');

    const stats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      filesByType: {} as Record<string, number>,
      filesByModule: {} as Record<string, number>
    };

    files.forEach(file => {
      // Estadísticas por tipo
      const mainType = file.mimetype.split('/')[0];
      stats.filesByType[mainType] = (stats.filesByType[mainType] || 0) + 1;

      // Estadísticas por módulo
      stats.filesByModule[file.module] = (stats.filesByModule[file.module] || 0) + 1;
    });

    return stats;
  }

  // Limpiar archivos huérfanos (sin referencia en BD)
  async cleanupOrphanFiles(): Promise<number> {
    const allFiles = await knex('uploaded_files').select('filename', 'path');
    const dbFilenames = new Set(allFiles.map(f => f.filename));
    
    let deletedCount = 0;
    const modules = ['avatars', 'documents', 'images', 'crm', 'rrhh', 'tasks', 'chat'];
    
    for (const module of modules) {
      const moduleDir = path.join(this.uploadDir, module);
      if (fs.existsSync(moduleDir)) {
        const files = fs.readdirSync(moduleDir);
        
        for (const file of files) {
          if (!dbFilenames.has(file)) {
            try {
              fs.unlinkSync(path.join(moduleDir, file));
              deletedCount++;
            } catch (error) {
              console.error(`Error eliminando archivo huérfano ${file}:`, error);
            }
          }
        }
      }
    }

    return deletedCount;
  }
  // Buscar archivos
  async searchFiles(params: {
    query: string;
    module?: string;
    mimetype?: string;
    userId: string;
    limit?: number;
  }): Promise<UploadedFile[]> {
    const { query, module, mimetype, userId, limit = 50 } = params;
    
    let knexQuery = knex('uploaded_files')
      .where('uploaded_by', userId)
      .where('original_name', 'ilike', `%${query}%`)
      .limit(limit)
      .orderBy('uploaded_at', 'desc');

    if (module) {
      knexQuery = knexQuery.where('module', module);
    }

    if (mimetype) {
      knexQuery = knexQuery.where('mimetype', 'like', `${mimetype}%`);
    }

    const files = await knexQuery;
    return files.map(this.mapFileRecord);
  }

  // Mapear registro de BD a interfaz
  private mapFileRecord(file: any): UploadedFile {
    return {
      id: file.id,
      originalName: file.original_name,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: file.uploaded_by,
      uploadedAt: file.uploaded_at,
      module: file.module,
      entityId: file.entity_id,
      entityType: file.entity_type
    };
  }
}

export default new FileService();
