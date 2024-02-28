import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API PostsAPP',
            version: '1.0.0',
            description: 'Documentación de mi API',
        },
    },
    apis: ['./src/controllers/*.ts'], // Ruta donde se encuentran tus controladores
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec