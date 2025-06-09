import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MEP-Projects API',
      version: '1.0.0',
      description: 'API completa para MEP-Projects - Sistema empresarial escalable',
      contact: {
        name: 'MEP Team',
        email: 'support@mep-projects.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.mep-projects.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación'
        }
      },
      schemas: {
        // Esquemas de autenticación
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@mep.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'admin123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@empresa.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'employee'],
              example: 'employee'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            name: {
              type: 'string',
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@empresa.com'
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'employee'],
              example: 'employee'
            },
            avatar: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/avatar.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Inicio de sesión exitoso'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        // Esquemas de CRM
        Customer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'Empresa ABC S.A.'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'contacto@empresa-abc.com'
            },
            phone: {
              type: 'string',
              example: '+1234567890'
            },
            address: {
              type: 'string',
              example: 'Calle Principal 123, Ciudad'
            },
            website: {
              type: 'string',
              example: 'https://empresa-abc.com'
            },
            industry: {
              type: 'string',
              example: 'Tecnología'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'prospect'],
              example: 'active'
            }
          }
        },
        Lead: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            customerId: {
              type: 'string',
              format: 'uuid'
            },
            title: {
              type: 'string',
              example: 'Oportunidad de venta de software'
            },
            description: {
              type: 'string',
              example: 'Cliente interesado en nuestro software de gestión'
            },
            value: {
              type: 'number',
              example: 15000.00
            },
            status: {
              type: 'string',
              enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
              example: 'qualified'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high'
            },
            assignedTo: {
              type: 'string',
              format: 'uuid'
            }
          }
        },
        // Esquemas de RRHH
        Department: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'Tecnología'
            },
            description: {
              type: 'string',
              example: 'Departamento de desarrollo y sistemas'
            },
            managerId: {
              type: 'string',
              format: 'uuid',
              nullable: true
            }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            userId: {
              type: 'string',
              format: 'uuid'
            },
            employeeCode: {
              type: 'string',
              example: 'EMP001'
            },
            departmentId: {
              type: 'string',
              format: 'uuid'
            },
            positionId: {
              type: 'string',
              format: 'uuid'
            },
            hireDate: {
              type: 'string',
              format: 'date'
            },
            salary: {
              type: 'number',
              example: 50000.00
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'terminated'],
              example: 'active'
            }
          }
        },
        // Esquemas de Tasks
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'Desarrollo de nueva funcionalidad'
            },
            description: {
              type: 'string',
              example: 'Implementación de módulo de reportes'
            },
            status: {
              type: 'string',
              enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
              example: 'active'
            },
            startDate: {
              type: 'string',
              format: 'date'
            },
            endDate: {
              type: 'string',
              format: 'date'
            },
            managerId: {
              type: 'string',
              format: 'uuid'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            projectId: {
              type: 'string',
              format: 'uuid'
            },
            title: {
              type: 'string',
              example: 'Implementar autenticación JWT'
            },
            description: {
              type: 'string',
              example: 'Configurar middleware de autenticación con JWT'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'review', 'done'],
              example: 'in_progress'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              example: 'high'
            },
            assignedTo: {
              type: 'string',
              format: 'uuid'
            },
            dueDate: {
              type: 'string',
              format: 'date'
            }
          }
        },
        // Esquemas de Chat
        ChatRoom: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'Equipo de Desarrollo'
            },
            description: {
              type: 'string',
              example: 'Chat del equipo de desarrollo'
            },
            type: {
              type: 'string',
              enum: ['direct', 'group', 'public'],
              example: 'group'
            },
            createdBy: {
              type: 'string',
              format: 'uuid'
            }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            roomId: {
              type: 'string',
              format: 'uuid'
            },
            senderId: {
              type: 'string',
              format: 'uuid'
            },
            content: {
              type: 'string',
              example: 'Hola equipo, ¿cómo van con el proyecto?'
            },
            type: {
              type: 'string',
              enum: ['text', 'image', 'file'],
              example: 'text'
            },
            sentAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        // Esquemas de Files
        UploadedFile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            originalName: {
              type: 'string',
              example: 'documento.pdf'
            },
            filename: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000.pdf'
            },
            mimetype: {
              type: 'string',
              example: 'application/pdf'
            },
            size: {
              type: 'number',
              example: 1024000
            },
            module: {
              type: 'string',
              example: 'documents'
            },
            uploadedBy: {
              type: 'string',
              format: 'uuid'
            },
            uploadedAt: {
              type: 'string',
              format: 'date-time'
            },
            downloadUrl: {
              type: 'string',
              example: '/api/files/download/documents/123e4567.pdf'
            }
          }
        },
        // Esquemas de respuesta estándar
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operación exitosa'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error en la operación'
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
