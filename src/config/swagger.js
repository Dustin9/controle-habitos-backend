const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
                url: `http://localhost:${process.env.PORT}`, 
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
    apis: ['./src/routes/*.js', './src/models/*.js', './src/controllers/*.js'], // Fixed path
};

const specs = swaggerJsdoc(options);

const swaggerConfig = (app) => {
    // Serve Swagger UI at /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    
    // Serve OpenAPI spec at /api-docs.json
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};

module.exports = swaggerConfig;