import fs from 'fs';
import path from 'path';
import { db } from '../../src/config/database';
import FileService from '../../src/services/FileService';

describe('FileService', () => {
  const testUploadDir = path.join(process.cwd(), 'test-uploads');
  let testUserId: string;

  beforeAll(async () => {
    await db.migrate.latest();
    
    // Crear directorio de pruebas
    if (!fs.existsSync(testUploadDir)) {
      fs.mkdirSync(testUploadDir, { recursive: true });
    }

    // Crear usuario de prueba
    const [user] = await db('users').insert({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'employee'
    }).returning('*');
    
    testUserId = user.id;
  });

  afterAll(async () => {
    // Limpiar directorio de pruebas
    if (fs.existsSync(testUploadDir)) {
      fs.rmSync(testUploadDir, { recursive: true, force: true });
    }
    
    await db.migrate.rollback();
    await db.destroy();
  });

  beforeEach(async () => {
    // Limpiar archivos antes de cada prueba
    await db('uploaded_files').del();
  });

  describe('saveFileRecord', () => {
    it('should save file record successfully', async () => {
      const fileData = {
        originalName: 'test-document.pdf',
        filename: 'unique-filename.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/documents/unique-filename.pdf',
        uploadedBy: testUserId,
        module: 'documents'
      };

      const savedFile = await FileService.saveFileRecord(fileData);

      expect(savedFile).toBeDefined();
      expect(savedFile.id).toBeDefined();
      expect(savedFile.originalName).toBe(fileData.originalName);
      expect(savedFile.filename).toBe(fileData.filename);
      expect(savedFile.uploadedBy).toBe(testUserId);
      expect(savedFile.uploadedAt).toBeDefined();
    });

    it('should save file with entity association', async () => {
      const fileData = {
        originalName: 'customer-document.pdf',
        filename: 'customer-doc.pdf',
        mimetype: 'application/pdf',
        size: 2048,
        path: '/uploads/crm/customer-doc.pdf',
        uploadedBy: testUserId,
        module: 'crm',
        entityId: 'customer-123',
        entityType: 'customer'
      };

      const savedFile = await FileService.saveFileRecord(fileData);

      expect(savedFile.entityId).toBe('customer-123');
      expect(savedFile.entityType).toBe('customer');
      expect(savedFile.module).toBe('crm');
    });
  });

  describe('getFilesByEntity', () => {
    it('should return files for specific entity', async () => {
      const entityId = 'test-entity-123';
      const entityType = 'customer';

      // Crear archivos de prueba
      const file1Data = {
        originalName: 'document1.pdf',
        filename: 'doc1.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/crm/doc1.pdf',
        uploadedBy: testUserId,
        module: 'crm',
        entityId,
        entityType
      };

      const file2Data = {
        originalName: 'document2.pdf',
        filename: 'doc2.pdf',
        mimetype: 'application/pdf',
        size: 2048,
        path: '/uploads/crm/doc2.pdf',
        uploadedBy: testUserId,
        module: 'crm',
        entityId,
        entityType
      };

      await FileService.saveFileRecord(file1Data);
      await FileService.saveFileRecord(file2Data);

      // Crear archivo para otra entidad
      await FileService.saveFileRecord({
        ...file1Data,
        entityId: 'other-entity',
        filename: 'other.pdf'
      });

      const files = await FileService.getFilesByEntity(entityType, entityId);

      expect(files).toHaveLength(2);
      expect(files[0].entityId).toBe(entityId);
      expect(files[1].entityId).toBe(entityId);
    });

    it('should return empty array for non-existent entity', async () => {
      const files = await FileService.getFilesByEntity('customer', 'non-existent');
      expect(files).toHaveLength(0);
    });
  });

  describe('getFilesByModule', () => {
    it('should return files for specific module', async () => {
      // Crear archivos en diferentes módulos
      await FileService.saveFileRecord({
        originalName: 'crm-file.pdf',
        filename: 'crm.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/crm/crm.pdf',
        uploadedBy: testUserId,
        module: 'crm'
      });

      await FileService.saveFileRecord({
        originalName: 'rrhh-file.pdf',
        filename: 'rrhh.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/rrhh/rrhh.pdf',
        uploadedBy: testUserId,
        module: 'rrhh'
      });

      const crmFiles = await FileService.getFilesByModule('crm');
      const rrhhFiles = await FileService.getFilesByModule('rrhh');

      expect(crmFiles).toHaveLength(1);
      expect(crmFiles[0].module).toBe('crm');
      expect(rrhhFiles).toHaveLength(1);
      expect(rrhhFiles[0].module).toBe('rrhh');
    });

    it('should filter by user when userId provided', async () => {
      // Crear otro usuario
      const [otherUser] = await db('users').insert({
        name: 'Other User',
        email: 'other@example.com',
        password: 'hashedpassword',
        role: 'employee'
      }).returning('*');

      // Crear archivos para ambos usuarios
      await FileService.saveFileRecord({
        originalName: 'my-file.pdf',
        filename: 'my.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/documents/my.pdf',
        uploadedBy: testUserId,
        module: 'documents'
      });

      await FileService.saveFileRecord({
        originalName: 'other-file.pdf',
        filename: 'other.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/documents/other.pdf',
        uploadedBy: otherUser.id,
        module: 'documents'
      });

      const myFiles = await FileService.getFilesByModule('documents', testUserId);
      const allFiles = await FileService.getFilesByModule('documents');

      expect(myFiles).toHaveLength(1);
      expect(myFiles[0].uploadedBy).toBe(testUserId);
      expect(allFiles).toHaveLength(2);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully by owner', async () => {
      const fileData = {
        originalName: 'delete-me.pdf',
        filename: 'delete.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/documents/delete.pdf',
        uploadedBy: testUserId,
        module: 'documents'
      };

      const savedFile = await FileService.saveFileRecord(fileData);
      const deleted = await FileService.deleteFile(savedFile.id, testUserId);

      expect(deleted).toBe(true);

      const fileInDb = await FileService.getFileById(savedFile.id);
      expect(fileInDb).toBeNull();
    });

    it('should prevent deletion by non-owner non-admin', async () => {
      // Crear otro usuario
      const [otherUser] = await db('users').insert({
        name: 'Other User',
        email: 'other@example.com',
        password: 'hashedpassword',
        role: 'employee'
      }).returning('*');

      const fileData = {
        originalName: 'protected.pdf',
        filename: 'protected.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/documents/protected.pdf',
        uploadedBy: testUserId,
        module: 'documents'
      };

      const savedFile = await FileService.saveFileRecord(fileData);

      await expect(FileService.deleteFile(savedFile.id, otherUser.id))
        .rejects.toThrow('No tienes permisos para eliminar este archivo');
    });

    it('should allow admin to delete any file', async () => {
      // Crear usuario admin
      const [adminUser] = await db('users').insert({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword',
        role: 'admin'
      }).returning('*');

      const fileData = {
        originalName: 'admin-delete.pdf',
        filename: 'admin-delete.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        path: '/uploads/documents/admin-delete.pdf',
        uploadedBy: testUserId,
        module: 'documents'
      };

      const savedFile = await FileService.saveFileRecord(fileData);
      const deleted = await FileService.deleteFile(savedFile.id, adminUser.id);

      expect(deleted).toBe(true);
    });
  });

  describe('getFileStats', () => {
    it('should return correct file statistics', async () => {
      // Crear archivos de diferentes tipos
      const files = [
        {
          originalName: 'doc1.pdf',
          filename: 'doc1.pdf',
          mimetype: 'application/pdf',
          size: 1024,
          path: '/uploads/documents/doc1.pdf',
          uploadedBy: testUserId,
          module: 'documents'
        },
        {
          originalName: 'image1.jpg',
          filename: 'image1.jpg',
          mimetype: 'image/jpeg',
          size: 2048,
          path: '/uploads/images/image1.jpg',
          uploadedBy: testUserId,
          module: 'images'
        },
        {
          originalName: 'doc2.pdf',
          filename: 'doc2.pdf',
          mimetype: 'application/pdf',
          size: 1500,
          path: '/uploads/documents/doc2.pdf',
          uploadedBy: testUserId,
          module: 'documents'
        }
      ];

      for (const file of files) {
        await FileService.saveFileRecord(file);
      }

      const stats = await FileService.getFileStats(testUserId);

      expect(stats.totalFiles).toBe(3);
      expect(stats.totalSize).toBe(4572); // 1024 + 2048 + 1500
      expect(stats.filesByType.application).toBe(2);
      expect(stats.filesByType.image).toBe(1);
      expect(stats.filesByModule.documents).toBe(2);
      expect(stats.filesByModule.images).toBe(1);
    });
  });

  describe('fileFilter', () => {
    const mockCallback = jest.fn();
    const mockRequest = {};

    beforeEach(() => {
      mockCallback.mockClear();
    });

    it('should accept allowed file types', () => {
      const allowedFiles = [
        { mimetype: 'image/jpeg' },
        { mimetype: 'application/pdf' },
        { mimetype: 'text/plain' },
        { mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ];

      allowedFiles.forEach(file => {
        FileService.fileFilter(mockRequest, file as Express.Multer.File, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, true);
        mockCallback.mockClear();
      });
    });

    it('should reject disallowed file types', () => {
      const disallowedFiles = [
        { mimetype: 'application/x-executable' },
        { mimetype: 'video/mp4' },
        { mimetype: 'audio/mp3' }
      ];

      disallowedFiles.forEach(file => {
        FileService.fileFilter(mockRequest, file as Express.Multer.File, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            message: `Tipo de archivo no permitido: ${file.mimetype}`
          })
        );
        mockCallback.mockClear();
      });
    });
  });
});
