import { Router } from 'express';
import FileController from '../controllers/FileController';
import FileService from '../services/FileService';
import  authenticateToken  from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting para uploads
const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 uploads por ventana
  message: 'Demasiados uploads, intenta de nuevo más tarde'
});

// Configuración de multer
const upload = FileService.getMulterConfig();

// Rutas protegidas
router.use(authenticateToken.authenticate);

// Subir archivos (múltiples)
router.post('/upload', uploadLimit, upload.array('files', 5), FileController.uploadFiles);

// Subir archivo único
router.post('/upload-single', uploadLimit, upload.single('file'), FileController.uploadFiles);

// Descargar archivo
router.get('/download/:module/:filename', FileController.downloadFile);

// Ver archivo (streaming/inline)
router.get('/view/:module/:filename', FileController.viewFile);

// Obtener archivos por entidad
router.get('/entity/:entityType/:entityId', FileController.getFilesByEntity);

// Obtener archivos por módulo
router.get('/module/:module', FileController.getFilesByModule);

// Obtener información de archivo específico
router.get('/info/:id', FileController.getFileInfo);

// Eliminar archivo
router.delete('/:id', FileController.deleteFile);

// Buscar archivos
router.get('/search', FileController.searchFiles);

// Estadísticas de archivos
router.get('/stats', FileController.getFileStats);

// Limpiar archivos huérfanos (solo admin)
router.post('/cleanup', FileController.cleanupFiles);

export default router;
