import express from "express";
import { ResetController } from "../controllers/ResetController.js";

export const resetRouter = new express.Router();

/**
 * @swagger
 *  tags:
 *    name: Reset
 *    description: Reset the application
 */


/**
 * @swagger
 *  /reset:
 *    post:
 *      tags:
 *        - Reset
 *      description: Reset the application to its initial state
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: No request body required
 *        required: false
 *      responses:
 *        200:
 *          description: Application reset successfully
 *        500:
 *          description: Internal server error
 */

resetRouter.post("/reset", (req, res, next) => {
  ResetController.resetApp(req, res).then( () => {
    res.json();
  }).catch(err => {
    next(err);
  })
});