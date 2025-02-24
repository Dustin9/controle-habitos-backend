const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Hábitos',
            version: '1.0.0',
            description: 'Documentação da API para o app de controle de hábitos',
        },
        servers: [
            {
                url: 'http://localhost:5000', // Altere para sua URL em produção
                description: 'Servidor Local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js', './src/models/*.js', '.src/controllers/*.js'], // Caminho dos arquivos com as anotações
};

const specs = swaggerJsdoc(options);

const swaggerConfig = (app) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerConfig;