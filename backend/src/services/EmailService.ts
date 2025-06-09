// filepath: backend/src/services/EmailService.ts
import nodemailer from 'nodemailer';
import { AppError } from '../middleware/errorHandler';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  data?: Record<string, any>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter;
  static async initialize(): Promise<void> {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verificar conexión en desarrollo
    if (process.env.NODE_ENV === 'development') {
      try {
        await this.transporter.verify();
        console.log('📧 Email service initialized successfully');
      } catch (error) {
        console.warn('⚠️ Email service verification failed:', error);
      }
    }
  }

  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      // En desarrollo, solo log del email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email que se enviaría:', {
          to: options.to,
          subject: options.subject,
          html: options.html?.substring(0, 100) + '...',
        });
        return;
      }

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new AppError('Error enviando email', 500);
    }
  }

  // Plantillas de email
  static getWelcomeTemplate(data: { name: string; email: string; loginUrl: string }): EmailTemplate {
    return {
      subject: '¡Bienvenido a MEP-Projects!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a MEP-Projects</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>¡Bienvenido a MEP-Projects!</h1>
              <p>Tu plataforma de gestión empresarial</p>
            </div>
            <div class="content">
              <h2>Hola ${data.name},</h2>
              <p>¡Nos complace darte la bienvenida a MEP-Projects! Tu cuenta ha sido creada exitosamente.</p>
              
              <p><strong>Detalles de tu cuenta:</strong></p>
              <ul>
                <li>Email: ${data.email}</li>
                <li>Fecha de registro: ${new Date().toLocaleDateString('es-ES')}</li>
              </ul>
              
              <p>Ya puedes comenzar a usar todas las funcionalidades de la plataforma:</p>
              <ul>
                <li>📊 Panel de control personalizado</li>
                <li>👥 Gestión de clientes y CRM</li>
                <li>📋 Administración de proyectos y tareas</li>
                <li>💬 Sistema de chat en tiempo real</li>
                <li>👤 Gestión de recursos humanos</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${data.loginUrl}" class="button">Acceder a la Plataforma</a>
              </div>
              
              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
              
              <p>¡Esperamos que disfrutes usando MEP-Projects!</p>
            </div>
            <div class="footer">
              <p>© 2024 MEP-Projects. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ¡Bienvenido a MEP-Projects!
        
        Hola ${data.name},
        
        ¡Nos complace darte la bienvenida a MEP-Projects! Tu cuenta ha sido creada exitosamente.
        
        Detalles de tu cuenta:
        - Email: ${data.email}
        - Fecha de registro: ${new Date().toLocaleDateString('es-ES')}
        
        Accede a la plataforma: ${data.loginUrl}
        
        ¡Esperamos que disfrutes usando MEP-Projects!
        
        © 2024 MEP-Projects. Todos los derechos reservados.
      `
    };
  }

  static getPasswordResetTemplate(data: { name: string; resetUrl: string; expiresIn: string }): EmailTemplate {
    return {
      subject: 'Restablecer tu contraseña - MEP-Projects',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecer Contraseña</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🔐 Restablecer Contraseña</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.name},</h2>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en MEP-Projects.</p>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace expirará en ${data.expiresIn}. Si no solicitaste este cambio, puedes ignorar este correo.
              </div>
              
              <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Restablecer Contraseña</a>
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">${data.resetUrl}</p>
              
              <p>Por tu seguridad:</p>
              <ul>
                <li>Este enlace solo se puede usar una vez</li>
                <li>Elige una contraseña segura y única</li>
                <li>No compartas tu contraseña con nadie</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 MEP-Projects. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Restablecer Contraseña - MEP-Projects
        
        Hola ${data.name},
        
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en MEP-Projects.
        
        IMPORTANTE: Este enlace expirará en ${data.expiresIn}. Si no solicitaste este cambio, puedes ignorar este correo.
        
        Para crear una nueva contraseña, visita: ${data.resetUrl}
        
        Por tu seguridad:
        - Este enlace solo se puede usar una vez
        - Elige una contraseña segura y única
        - No compartas tu contraseña con nadie
        
        © 2024 MEP-Projects. Todos los derechos reservados.
      `
    };
  }

  static getEmailVerificationTemplate(data: { name: string; verifyUrl: string }): EmailTemplate {
    return {
      subject: 'Verifica tu correo electrónico - MEP-Projects',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificar Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>✉️ Verificar Email</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.name},</h2>
              <p>¡Ya casi terminamos! Solo necesitamos verificar tu dirección de correo electrónico para completar el registro de tu cuenta en MEP-Projects.</p>
              
              <div style="text-align: center;">
                <a href="${data.verifyUrl}" class="button">Verificar Email</a>
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">${data.verifyUrl}</p>
              
              <p>Una vez verificado tu email, podrás acceder a todas las funcionalidades de la plataforma.</p>
              
              <p>Si no creaste una cuenta en MEP-Projects, puedes ignorar este correo.</p>
            </div>
            <div class="footer">
              <p>© 2024 MEP-Projects. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Verificar Email - MEP-Projects
        
        Hola ${data.name},
        
        ¡Ya casi terminamos! Solo necesitamos verificar tu dirección de correo electrónico para completar el registro de tu cuenta en MEP-Projects.
        
        Verifica tu email visitando: ${data.verifyUrl}
        
        Una vez verificado tu email, podrás acceder a todas las funcionalidades de la plataforma.
        
        Si no creaste una cuenta en MEP-Projects, puedes ignorar este correo.
        
        © 2024 MEP-Projects. Todos los derechos reservados.
      `
    };
  }

  static getTaskAssignmentTemplate(data: { 
    name: string; 
    taskTitle: string; 
    projectName: string; 
    priority: string; 
    dueDate: string; 
    taskUrl: string; 
  }): EmailTemplate {
    const priorityColors = {
      low: '#28a745',
      medium: '#ffc107', 
      high: '#fd7e14',
      urgent: '#dc3545'
    };

    return {
      subject: `Nueva tarea asignada: ${data.taskTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Tarea Asignada</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .task-card { background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 12px; color: white; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${priorityColors[data.priority as keyof typeof priorityColors] || '#6c757d'}; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>📋 Nueva Tarea Asignada</h1>
            </div>
            <div class="content">
              <h2>Hola ${data.name},</h2>
              <p>Se te ha asignado una nueva tarea en MEP-Projects:</p>
              
              <div class="task-card">
                <h3>${data.taskTitle}</h3>
                <p><strong>Proyecto:</strong> ${data.projectName}</p>
                <p><strong>Prioridad:</strong> <span class="priority">${data.priority}</span></p>
                <p><strong>Fecha límite:</strong> ${data.dueDate}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${data.taskUrl}" class="button">Ver Tarea</a>
              </div>
              
              <p>Recuerda revisar los detalles de la tarea y actualizar su progreso regularmente.</p>
            </div>
            <div class="footer">
              <p>© 2024 MEP-Projects. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Nueva Tarea Asignada - MEP-Projects
        
        Hola ${data.name},
        
        Se te ha asignado una nueva tarea en MEP-Projects:
        
        Tarea: ${data.taskTitle}
        Proyecto: ${data.projectName}
        Prioridad: ${data.priority}
        Fecha límite: ${data.dueDate}
        
        Ver tarea: ${data.taskUrl}
        
        Recuerda revisar los detalles de la tarea y actualizar su progreso regularmente.
        
        © 2024 MEP-Projects. Todos los derechos reservados.
      `
    };
  }

  // Métodos de conveniencia para enviar plantillas específicas
  static async sendWelcomeEmail(to: string, data: { name: string; email: string; loginUrl: string }): Promise<void> {
    const template = this.getWelcomeTemplate(data);
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  static async sendPasswordResetEmail(to: string, data: { name: string; resetUrl: string; expiresIn: string }): Promise<void> {
    const template = this.getPasswordResetTemplate(data);
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  static async sendEmailVerification(to: string, data: { name: string; verifyUrl: string }): Promise<void> {
    const template = this.getEmailVerificationTemplate(data);
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  static async sendTaskAssignmentEmail(to: string, data: { 
    name: string; 
    taskTitle: string; 
    projectName: string; 
    priority: string; 
    dueDate: string; 
    taskUrl: string; 
  }): Promise<void> {
    const template = this.getTaskAssignmentTemplate(data);
    await this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

export default EmailService;
