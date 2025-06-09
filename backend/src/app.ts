import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from '@config/index';
import { swaggerSpec } from '@config/swagger';
import { EmailService } from '@services/EmailService';
import routes from '@routes/index';
import { ErrorHandler } from '@middleware/errorHandler';
import { generalLimiter, requestSizeLimit } from '@middleware/rateLimiting';

class AppServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.chat.socketCorsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddlewares(): void {
    // Seguridad
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS
    this.app.use(cors(config.cors));

    // Compresión
    this.app.use(compression());

    // Logging
    if (config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Rate limiting
    this.app.use(generalLimiter);
    this.app.use(requestSizeLimit);

    // Parse JSON
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Servir archivos estáticos
    this.app.use('/uploads', express.static(config.upload.dir));

    // Headers adicionales
    this.app.use((req, res, next) => {
      res.header('X-API-Version', config.API_VERSION);
      res.header('X-Powered-By', 'MEP-Projects');
      next();
    });
  }

  private initializeRoutes(): void {
    // Ruta de bienvenida
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Bienvenido a MEP-Projects API',
        data: {
          version: config.API_VERSION,
          environment: config.NODE_ENV,
          docs: `/api/${config.API_VERSION}/health`,
        },
      });
    });

    // Montar rutas del API
    this.app.use(`/api/${config.API_VERSION}`, routes);
  }

  private initializeErrorHandling(): void {
    // Manejar 404
    this.app.use(ErrorHandler.notFound);

    // Manejar errores
    this.app.use(ErrorHandler.handle);
  }

  private initializeSocketIO(): void {
    this.io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.id}`);

      // Eventos de chat
      socket.on('join-channel', (channelId: string) => {
        socket.join(channelId);
        console.log(`Usuario ${socket.id} se unió al canal ${channelId}`);
      });

      socket.on('leave-channel', (channelId: string) => {
        socket.leave(channelId);
        console.log(`Usuario ${socket.id} dejó el canal ${channelId}`);
      });

      socket.on('send-message', (data) => {
        // Emitir mensaje a todos los usuarios del canal
        socket.to(data.channelId).emit('new-message', data);
      });

      socket.on('typing-start', (data) => {
        socket.to(data.channelId).emit('user-typing', {
          userId: data.userId,
          userName: data.userName,
        });
      });

      socket.on('typing-stop', (data) => {
        socket.to(data.channelId).emit('user-stopped-typing', {
          userId: data.userId,
        });
      });

      // Eventos de presencia
      socket.on('user-online', (userId: string) => {
        socket.broadcast.emit('user-status-changed', {
          userId,
          status: 'online',
        });
      });

      socket.on('user-away', (userId: string) => {
        socket.broadcast.emit('user-status-changed', {
          userId,
          status: 'away',
        });
      });

      socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
      });
    });
  }
  public async listen(): Promise<void> {
    // Inicializar servicios
    await this.initializeServices();
    
    this.server.listen(config.PORT, () => {
      console.log(`
🚀 MEP-Projects API está funcionando!

📊 Información del servidor:
   • Puerto: ${config.PORT}
   • Entorno: ${config.NODE_ENV}
   • API Version: ${config.API_VERSION}

📡 Endpoints disponibles:
   • Health Check: http://localhost:${config.PORT}/api/${config.API_VERSION}/health
   • Documentación: http://localhost:${config.PORT}/
   • Socket.IO: http://localhost:${config.PORT}

🔧 Base de datos:
   • Host: ${config.database.host}:${config.database.port}
   • Database: ${config.database.database}

⏰ Iniciado en: ${new Date().toLocaleString()}
      `);
    });
  }

  private async initializeServices(): Promise<void> {
    try {
      // Inicializar servicio de email
      await EmailService.initialize();
      console.log('✅ Servicios inicializados correctamente');
    } catch (error) {
      console.error('❌ Error inicializando servicios:', error);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default AppServer;
