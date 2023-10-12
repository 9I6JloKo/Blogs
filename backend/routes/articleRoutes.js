const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const JWTOptional = require('../middleware/JWTOptional');
const articleController = require('../controllers/articlesController');

router.get('/feed', verifyJWT, articleController.feedArticles);

//Список статей
router.get('/', JWTOptional, articleController.listArticles);

//чтение статьей
router.get('/:slug',verifyJWT, articleController.getArticleWithSlug);

//Создание статьи
router.post('/', verifyJWT, articleController.createArticle);

//Удаление статьи
router.delete('/:slug', verifyJWT, articleController.deleteArticle);

//Избранные статьи
router.post('/:slug/favorite', verifyJWT, articleController.favoriteArticle);

router.delete('/:slug/favorite', verifyJWT, articleController.unfavoriteArticle);

//Обновление
router.put('/:slug', verifyJWT, articleController.updateArticle);


module.exports = router;


/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get a list of articles
 *     tags: [Articles]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of articles to retrieve (default is 20)
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: offset
 *         in: query
 *         description: Number of articles to skip (default is 0)
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: tag
 *         in: query
 *         description: Filter articles by tag
 *         schema:
 *           type: string
 *       - name: author
 *         in: query
 *         description: Filter articles by author username
 *         schema:
 *           type: string
 *       - name: favorited
 *         in: query
 *         description: Filter articles favorited by a user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 articlesCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *     security:
 *       - JWTAuth: []
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         bio:
 *           type: string
 *         image:
 *           type: string
 *           format: uri
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         body:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *         favorited:
 *           type: boolean
 *         favoritesCount:
 *           type: integer
 *         author:
 *           $ref: '#/components/schemas/Profile'
 *
 *   securitySchemes:
 *     JWTAuth:
 *       type: apiKey
 *       name: Authorization
 *       in: header
 *       default: "Token "
 *
 * /api/articles/{slug}:
 *   get:
 *     summary: Get an article by slug
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         description: The unique slug of the article
 *         schema:
 *           type: string
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *       403:
 *         description: Forbidden, user not authenticated
 *       401:
 *         description: Unauthorized, invalid or expired token
 */

/**
 * @swagger
 * /api/articles/feed:
 *   get:
 *     summary: Get a list of articles from followed users
 *     tags: [Articles]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of articles to retrieve (default is 20)
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: offset
 *         in: query
 *         description: Number of articles to skip (default is 0)
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 articlesCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create an article
 *     tags: [Articles]
 *     security:
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleCreate'
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Unprocessable Entity
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     ArticleCreate:
 *       type: object
 *       properties:
 *         article:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Title of the article
 *               example: Sample Article
 *               minLength: 1
 *               maxLength: 255
 *               required: true
 *             description:
 *               type: string
 *               description: Description of the article
 *               example: This is a sample article description.
 *               maxLength: 2000
 *               required: true
 *             body:
 *               type: string
 *               description: Body/content of the article
 *               example: This is the main content of the article.
 *               maxLength: 5000
 *               required: true
 *             tagList:
 *               type: array
 *               description: List of tags associated with the article
 *               items:
 *                 type: string
 *               example: ["sample", "article"]
 *     Article:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 * 
 * tags:
 *   - name: Articles
 *     description: API for managing articles
 */

/**
 * @swagger
 * /api/articles/{slug}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article successfully deleted!!!"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Article Not Found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 * 
 * tags:
 *   - name: Articles
 *     description: API for managing articles
 */

/**
 * @swagger
 * /api/articles/{slug}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated article data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               article:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   body:
 *                     type: string
 *                   tagList:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Article Not Found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 * 
 * tags:
 *   - name: Articles
 *     description: API for managing articles
 */

/**
 * @swagger
 * /api/articles/{slug}/favorite:
 *   post:
 *     summary: Favorite an article
 *     tags: [Articles]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to favorite
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article favorited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article Not Found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 * 
 * tags:
 *   - name: Articles
 *     description: API for managing articles
 */

/**
 * @swagger
 * /api/articles/{slug}/favorite:
 *   delete:
 *     summary: Unfavorite an article
 *     tags: [Articles]
 *     security:
 *       - JWTAuth: []
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Slug of the article to unfavorite
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article unfavorited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article Not Found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         tagList:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 * 
 * tags:
 *   - name: Articles
 *     description: API for managing articles
 */