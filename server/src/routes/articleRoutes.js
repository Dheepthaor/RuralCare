import express from 'express';
import {
  getArticles,
  getArticleBySlugOrId,
  createArticle,
  updateArticle,
  toggleArticleStatus,
} from '../controllers/articleController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/:identifier', getArticleBySlugOrId);
router.post('/', authenticate, authorizeAdmin, createArticle);
router.put('/:id', authenticate, authorizeAdmin, updateArticle);
router.patch('/:id/status', authenticate, authorizeAdmin, toggleArticleStatus);

export default router;
