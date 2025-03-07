import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Custom URL Shortener API",
            version: "1.0.0",
            description: "A simple URL shortener API with analytics",
        },
        servers: [
            {
                url: "http://localhost:4444",
                description: "Local Server",
            },
            {
                url: "https://your-deployed-url.com",
                description: "Production Server",
            }
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default function swaggerSetup(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
