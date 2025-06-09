import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import FileService from '../services/FileService';
import { ApiResponseBuilder } from '../utils/response';
import { AuthenticatedRequest } from '../types/common';

export class FileController {
  // Subir archivos
  async uploadFiles(req: AuthenticatedRequest, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      const { module, entityId, entityType } = req.body;
      
      if (!files || files.length === 0) {
        return ApiResponseBuilder.error(res, 'No se subieron archivos', 400);
      }

      const uploadedFiles = [];

      for (const file of files) {
        const fileRecord = await FileService.saveFileRecord({
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          uploadedBy: req.user!.id,
          module: module || 'documents',
          entityId,
          entityType
        });

        uploadedFiles.push({
          ...fileRecord,
          downloadUrl: FileService.getDownloadUrl(file.filename, module || 'documents')
        });
      }

      return ApiResponseBuilder.success(res, uploadedFiles, 'Archivos subidos exitosamente');
    } catch (error) {
      console.error('Error subiendo archivos:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Descargar archivo
  async downloadFile(req: Request, res: Response) {
    try {
      const { module, filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', module, filename);

      if (!FileService.fileExists(filePath)) {
        return ApiResponseBuilder.error(res, 'Archivo no encontrado', 404);
      }

      // Obtener información del archivo de la BD
      const fileRecord = await FileService.getFileById(req.params.id || '');
      
      if (fileRecord) {
        res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.originalName}"`);
        res.setHeader('Content-Type', fileRecord.mimetype);
      }

      return res.sendFile(filePath);
    } catch (error) {
      console.error('Error descargando archivo:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Ver archivo (streaming)
  async viewFile(req: Request, res: Response) {
    try {
      const { module, filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', module, filename);

      if (!FileService.fileExists(filePath)) {
        return ApiResponseBuilder.error(res, 'Archivo no encontrado', 404);
      }

      const fileRecord = await FileService.getFileById(req.params.id || '');
      
      if (fileRecord) {
        res.setHeader('Content-Type', fileRecord.mimetype);
        
        // Para imágenes, permitir visualización inline
        if (fileRecord.mimetype.startsWith('image/')) {
          res.setHeader('Content-Disposition', 'inline');
        }
      }

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } catch (error) {
      console.error('Error visualizando archivo:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener archivos por entidad
  async getFilesByEntity(req: AuthenticatedRequest, res: Response) {
    try {
      const { entityType, entityId } = req.params;
      const files = await FileService.getFilesByEntity(entityType, entityId);

      const filesWithUrls = files.map(file => ({
        ...file,
        downloadUrl: FileService.getDownloadUrl(file.filename, file.module!),
        viewUrl: `/api/files/view/${file.module}/${file.filename}`      }));

      return ApiResponseBuilder.success(res, filesWithUrls, 'Archivos obtenidos exitosamente');
    } catch (error) {
      console.error('Error obteniendo archivos por entidad:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener archivos por módulo
  async getFilesByModule(req: AuthenticatedRequest, res: Response) {
    try {
      const { module } = req.params;
      const { mine } = req.query;
      
      const userId = mine === 'true' ? req.user!.id : undefined;
      const files = await FileService.getFilesByModule(module, userId);

      const filesWithUrls = files.map(file => ({
        ...file,
        downloadUrl: FileService.getDownloadUrl(file.filename, file.module!),      viewUrl: `/api/files/view/${file.module}/${file.filename}`
      }));

      return ApiResponseBuilder.success(res, filesWithUrls, 'Archivos obtenidos exitosamente');
    } catch (error) {
      console.error('Error obteniendo archivos por módulo:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener información de archivo
  async getFileInfo(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const file = await FileService.getFileById(id);

      if (!file) {
        return ApiResponseBuilder.error(res, 'Archivo no encontrado', 404);
      }      const fileWithUrls = {
        ...file,
        downloadUrl: FileService.getDownloadUrl(file.filename, file.module!),
        viewUrl: `/api/files/view/${file.module}/${file.filename}`
      };

      return ApiResponseBuilder.success(res, fileWithUrls, 'Información del archivo obtenida');
    } catch (error) {
      console.error('Error obteniendo información del archivo:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Eliminar archivo
  async deleteFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await FileService.deleteFile(id, req.user!.id);

      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Archivo no encontrado', 404);
      }

      return ApiResponseBuilder.success(res, 'Archivo eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      if (error instanceof Error && error.message.includes('permisos')) {
        return ApiResponseBuilder.error(res, error.message, 403);
      }
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener estadísticas de archivos
  async getFileStats(req: AuthenticatedRequest, res: Response) {
    try {
      const { global } = req.query;
      const userId = global === 'true' && req.user!.role === 'admin' ? undefined : req.user!.id;
        const stats = await FileService.getFileStats(userId);
      return ApiResponseBuilder.success(res, stats, 'Estadísticas obtenidas exitosamente');
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Limpiar archivos huérfanos (solo admin)
  async cleanupFiles(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.user!.role !== 'admin') {
        return ApiResponseBuilder.error(res, 'Solo los administradores pueden realizar esta acción', 403);
      }      const deletedCount = await FileService.cleanupOrphanFiles();
      return ApiResponseBuilder.success(res, { deletedCount }, `Se eliminaron ${deletedCount} archivos huérfanos`);
    } catch (error) {
      console.error('Error limpiando archivos:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }

  // Buscar archivos
  async searchFiles(req: AuthenticatedRequest, res: Response) {
    try {
      const { q, module, type, limit = 50 } = req.query;
      
      if (!q) {
        return ApiResponseBuilder.error(res, 'Parámetro de búsqueda requerido', 400);
      }

      // Implementar búsqueda básica por nombre
      const files = await FileService.searchFiles({
        query: q as string,
        module: module as string,
        mimetype: type as string,
        userId: req.user!.id,
        limit: parseInt(limit as string)
      });

      const filesWithUrls = files.map(file => ({
        ...file,
        downloadUrl: FileService.getDownloadUrl(file.filename, file.module!),
        viewUrl: `/api/files/view/${file.module}/${file.filename}`      }));

      return ApiResponseBuilder.success(res, filesWithUrls, 'Búsqueda completada');
    } catch (error) {
      console.error('Error buscando archivos:', error);
      return ApiResponseBuilder.error(res, 'Error interno del servidor', 500);
    }
  }
}

export default new FileController();
