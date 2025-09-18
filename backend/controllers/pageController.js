const Page = require('../models/Page');

// GET /api/pages/:slug
const getPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    next(err);
  }
};

// PUT /api/pages/:slug
const updatePageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    const page = await Page.findOneAndUpdate(
      { slug },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!page) return res.status(404).json({ message: 'Page not found' });

    res.json(page);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageBySlug,
  updatePageBySlug,
};
