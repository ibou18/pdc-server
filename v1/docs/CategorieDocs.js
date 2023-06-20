/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     description: Recupere toutes les categories
 *     tags:
 *       - Categorie
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     description: Creer une nouvelle categorie
 *     tags:
 *       - Categorie
 *     consumes:
 *          - application/json:
 *     parameters:
 *        - in: body
 *          name: Categorie
 *          description: Cree une nouvelle categorie
 *          schema:
 *              type: object
 *              required:
 *                - nom
 *              properties:
 *                  nom:
 *                      type: string
 *                  description:
 *                      type: string
 *                  status:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
