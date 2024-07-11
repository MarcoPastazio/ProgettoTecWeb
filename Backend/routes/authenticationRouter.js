import express from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authenticationRouter = express.Router();

/**
 * @swagger
 *  tags:
 *    name: Registrazione e login
 *    description: Autenticazione e registrazione
 */

/**
 * @swagger
 *  /auth:
 *    post:
 *      tags:
 *        - Registrazione e login
 *      summary: Effettua il login
 *      description: Autenticazione dell'utente
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: credenziali dell'utente per l'autenticazione
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: Kyle
 *                password:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
 */

/**
 * @swagger
 *  /signup:
 *    post:
 *      tags:
 *        - Registrazione e login
 *      summary: Effettua una nuova registrazione
 *      description: Registra un nuovo utente
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: Informazioni utente per la registrazione
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: Kyle
 *                password:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User registered successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  username:
 *                    type: string
 *        500:
 *          description: Could not save user
 */


authenticationRouter.post("/auth", async (req, res) => {
  let isAuthenticated = await AuthController.checkCredentials(req, res);
  if(isAuthenticated){
    res.json(AuthController.issueToken(req.body.username));
  } else {
    res.status(401);
    res.json( {error: "Credenziali non valide. Riprova."});
  }
});

authenticationRouter.post("/signup", (req, res, next) => {
  AuthController.saveUser(req, res).then((user) => {
    res.json(user);
  }).catch((err) => {
    next({status: 500, message: "Impossibile salvare l'utente"});
  })
});