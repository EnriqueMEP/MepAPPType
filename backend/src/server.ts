import 'module-alias/register';
import { config } from '@config/index';
import { db } from '@config/database';
import AppServer from './app';

// Manejar errores no capturados
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection(): Promise<void> {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    
    if (config.NODE_ENV === 'development') {
      console.log(`
📝 Instrucciones para configurar PostgreSQL:

1. Instalar PostgreSQL:
   • Windows: Descargar desde https://www.postgresql.org/download/windows/
   • macOS: brew install postgresql
   • Linux: sudo apt-get install postgresql

2. Crear base de datos y usuario:
   sudo -u postgres psql
   CREATE DATABASE ${config.database.database};
   CREATE USER ${config.database.user} WITH PASSWORD '${config.database.password}';
   GRANT ALL PRIVILEGES ON DATABASE ${config.database.database} TO ${config.database.user};

3. Ejecutar migraciones:
   npm run migrate

4. Llenar datos de prueba (opcional):
   npm run seed
      `);
    }
    
    process.exit(1);
  }
}

// Función para manejar el cierre graceful
function handleGracefulShutdown(): void {
  const gracefulShutdown = (signal: string) => {
    console.log(`\n📴 Señal ${signal} recibida. Cerrando servidor...`);
    
    // Cerrar conexión a la base de datos
    db.destroy().then(() => {
      console.log('✅ Conexión a la base de datos cerrada');
      process.exit(0);
    }).catch((error) => {
      console.error('❌ Error al cerrar la base de datos:', error);
      process.exit(1);
    });
  };

  // Escuchar señales de cierre
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

// Función principal para iniciar el servidor
async function startServer(): Promise<void> {
  try {
    console.log('🔄 Iniciando MEP-Projects Backend...');
    
    // Verificar conexión a la base de datos
    await checkDatabaseConnection();
      // Crear y iniciar el servidor
    const appServer = new AppServer();
    await appServer.listen();
    
    // Configurar cierre graceful
    handleGracefulShutdown();
    
  } catch (error) {
    console.error('💥 Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
if (require.main === module) {
  startServer();
}

export default startServer;
