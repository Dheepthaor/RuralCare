import { HealthArticle } from '../models/HealthArticle.js';

export const getArticles = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;

    const query = { active: true };

    if (category && category !== 'ALL') {
      query.category = category.toUpperCase();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { content: searchRegex },
        { malayalamTitle: searchRegex },
        { malayalamSummary: searchRegex },
      ];
    }

    const articles = await HealthArticle.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await HealthArticle.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: articles.length,
      total,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

export const getArticleBySlugOrId = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let article;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      article = await HealthArticle.findById(identifier);
    } else {
      article = await HealthArticle.findOne({ slug: identifier.toLowerCase() });
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Health article not found.',
      });
    }

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const { title } = req.body;
    let slug = req.body.slug;
    if (!slug && title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const article = await HealthArticle.create({ ...req.body, slug });
    return res.status(201).json({
      success: true,
      message: 'Health article published successfully.',
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await HealthArticle.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Health article not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Health article updated successfully.',
      article,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleArticleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await HealthArticle.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Health article not found.',
      });
    }

    article.active = !article.active;
    await article.save();

    return res.status(200).json({
      success: true,
      message: `Article ${article.active ? 'activated' : 'deactivated'} successfully.`,
      article,
    });
  } catch (error) {
    next(error);
  }
};
