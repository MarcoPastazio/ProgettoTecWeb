import express from "express";
import { HiveMindController } from "../controllers/HivemindController.js";
import { ensureUsersModifyOnlyOwnIdeas } from "../middleware/authorization.js";

export const hiveMindRouter = new express.Router();

/**
 * @swagger
 *  tags:
 *    name: Idea
 *    description: Interazione utente con le idee
 */


/**
 * @swagger
 *  /editidea:
 *    post:
 *      tags:
 *        - Idea
 *      summary: Pubblicazione di una nuova idea
 *      description: Pubblica una nuova idea
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  example: New Idea
 *                description:
 *                  type: string
 *                  example: Description of the new idea
 *      responses:
 *        '200':
 *          description: Idea posted successfully
 *        '401':
 *          description: Unauthorized - Invalid token
 *        '500':
 *          description: Internal server error
 *      security:
 *        - bearerAuth: []
 */

hiveMindRouter.post("/editidea", (req, res, next) => {
  HiveMindController.editIdea(req).then(result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});

/**
 * @swagger
 * /ideas/{id}/vote:
 *   post:
 *     tags:
 *       - Idea
 *     summary: Vota un idea
 *     description: Votazione di una idea
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the idea to vote for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: like
 *     responses:
 *       200:
 *         description: Vote submitted successfully
 *       404:
 *         description: Idea not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

hiveMindRouter.post("/ideas/:id/vote", (req, res, next) => {
  HiveMindController.voteIdea(req).then(result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});



/**
 * @swagger
 *  /ideas:
 *    get:
 *      tags:
 *        - Idea
 *      summary: Prende le idee senza un preciso criterio
 *      description: Di deafult, senza una scelta, fa vedere semplicemente le idee
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: List of all ideas
 *        500:
 *          description: Internal server error
 */
hiveMindRouter.get("/ideas", (req, res, next) => {
  HiveMindController.getAllIdeas(req).then(ideas => {
    res.json(ideas);
  }).catch(err => {
    next(err);
  });
});

/**
 * @swagger
 *  /ideas/controversial:
 *    get:
 *      tags:
 *        - Idea
 *      summary: Prende le idee più controverse della settimana
 *      description: Prende le idee più controverse della settimana
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: List of controversial ideas
 *        500:
 *          description: Internal server error
 */
hiveMindRouter.get("/ideas/controversial", (req, res, next) => {
  HiveMindController.getControversialIdeas(req).then(ideas => {
    res.json(ideas);
  }).catch(err => {
    next(err);
  });
});

/**
 * @swagger
 *  /ideas/unpopular:
 *    get:
 *      tags:
 *        - Idea
 *      summary: Prende le idee più impopolare della settimana
 *      description: Prende le idee più impopolare della settimana
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: List of unpopular ideas
 *        500:
 *          description: Internal server error
 */
hiveMindRouter.get("/ideas/unpopular", (req, res, next) => {
  HiveMindController.getUnpopularIdeas(req).then(ideas => {
    res.json(ideas);
  }).catch(err => {
    next(err);
  });
});

/**
 * @swagger
 *  /ideas/mainstream:
 *    get:
 *      tags:
 *        - Idea
 *      summary: Prende le idee più mainstream della settimana
 *      description: Prende le idee più mainstream della settimana
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: List of mainstream ideas
 *        500:
 *          description: Internal server error
 */
hiveMindRouter.get("/ideas/mainstream", (req, res, next) => {
  HiveMindController.getMainstreamIdeas(req).then(ideas => {
    res.json(ideas);
  }).catch(err => {
    next(err);
  });
});

/**
 * @swagger
 *  /ideas/{id}:
 *    get:
 *      tags:
 *        - Idea
 *      summary: Ottieni i dettagli di una specifica idea
 *      description: Ottieni i dettagli di una specifica idea con i voti e commenti, mi serve per la delete
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID of the idea to get details for
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Idea details
 *        404:
 *          description: Idea not found
 *        500:
 *          description: Internal server error
 */

hiveMindRouter.get("/ideas/:id", (req, res, next) => {
  HiveMindController.getIdeaDetails(req).then(idea => {
    if (idea) {
      res.json(idea);
    } else {
      next({ status: 404, message: "Idea non trovata" });
    }
  }).catch(err => {
    next(err);
  });
});


/**
 * @swagger
 *  /ideas/{id}:
 *    delete:
 *      tags:
 *        - Idea
 *      summary: Cancella una specifica idea
 *      description: Cancella una specifica idea (solo chi l'ha creata lo può fare)
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID of the idea to delete
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Idea deleted successfully
 *        404:
 *          description: Idea not found
 *        500:
 *          description: Internal server error
 */
hiveMindRouter.delete("/ideas/:id", ensureUsersModifyOnlyOwnIdeas, (req, res, next) => {
  HiveMindController.delete(req).then(idea => {
    if (idea) {
      res.json(idea);
    } else {
      next({ status: 404, message: "Idea non trovata" });
    }
  }).catch(err => {
    next(err);
  });
});


/**
 * @swagger
 *  /comments:
 *    post:
 *      tags:
 *        - Idea
 *      summary: Pubblica un commento relativo all'idea
 *      description: Pubblica un commento relativo all'idea
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: Comment details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                commento:
 *                  type: object
 *                  properties:
 *                    ideaId:
 *                      type: string
 *                      example: 9
 *                    content:
 *                      type: string
 *                      example: This is a comment
 *      responses:
 *        200:
 *          description: Comment posted successfully
 *        404:
 *          description: Idea not found
 *        500:
 *          description: Internal server error
 *      security:
 *        - bearerAuth: []
 */
hiveMindRouter.post

hiveMindRouter.post("/comments", (req, res, next) => {
  HiveMindController.postComment(req).then(result => {
    res.json(result);
  }).catch(err => {
    next(err);
  });
});


/**
 * @swagger
 *  /comments/{id}:
 *    get:
 *      tags:
 *        - Idea
 *      summary: Prende i commenti di una specifica idea
 *      description: Prende i commenti di una specifica idea
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID of the idea to get comments for
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: List of comments
 *        404:
 *          description: Idea not found
 *        500:
 *          description: Internal server error
 */
hiveMindRouter.get("/comments/:id", (req, res, next) => {
  HiveMindController.getComments(req).then(comments => {
    res.json(comments);
  }).catch(err => {
    next(err);
  });
});


/**
 * @swagger
 * /count:
 *   get:
 *     tags:
 *       - Idea
 *     summary: Recupera il conteggio totale delle idee
 *     description: Mi serve per l'offset della paginazione per evitare di sforare e quindi non mostrare nulla
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             totalCount:
 *               type: integer
 *               example: 11
 *       500:
 *         description: Internal server error
 */

hiveMindRouter.get("/count", (req, res, next) => {
  HiveMindController.countIdeas(req).then(countData => {
    res.json(countData);
  }).catch(err => {
    next(err);
  });
});

