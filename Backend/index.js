import express from "express";
import morgan from "morgan"; 
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { hiveMindRouter } from "./routes/hiveMindRouter.js";
import { authenticationRouter } from "./routes/authenticationRouter.js";
import { enforceAuthentication } from "./middleware/authorization.js";

const app = express();
const PORT = 9000;

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());

app.use( (err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
  });
});


// Inizializza swagger-jsdoc -> restituisce le specifiche di swagger convalidate in formato json
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'HIVEMIND',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*Router.js'], //file contenenti annotazioni
});


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(authenticationRouter);
app.use(enforceAuthentication);
app.use(hiveMindRouter);


app.listen(PORT, () => {
    console.log(`server run http://localhost:${PORT}`);
});