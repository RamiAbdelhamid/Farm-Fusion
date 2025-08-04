
const Article = require("../model/articleModel");



// Get all articles with pagination
/****************************************************************************************
 * @desc    Get all articles with pagination
 * @route   GET /api/articles
 * @access  Public
 *  @param   {Object} req - The request object containing pagination parameters
 *  @param   {Object} res - The response object to send the result
 *  * @returns {Object} - The paginated list of articles or an error message
 ****************************************************************************************/
/****************************************************************************************/
exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const totalArticles = await Article.countDocuments();
    const totalPages = Math.ceil(totalArticles / limit);

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalArticles,
      articles,
    });
  } catch (error) {
    console.error("Fetch Articles Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};
/****************************************************************************************/
/****************************************************************************************/









// Add new article (unchanged)
/****************************************************************************************
 * @desc    Add new article
 * @route   POST /api/articles
 * @access  Private
 *  @param   {Object} req - The request object containing article data
 *  @param   {Object} res - The response object to send the result
 * @returns {Object} - The created article or an error message
 ****************************************************************************************/
/****************************************************************************************/
exports.addArticle = async (req, res) => {
  try {
    const { title, body, author, titleAr, bodyAr, titleFr, bodyFr } = req.body;
    const imageUrl = req.file ? `/uploads/articles/${req.file.filename}` : "";

    const newArticle = new Article({
      title,
      body,
      author,
      titleAr,
      bodyAr,
      titleFr,
      bodyFr,
      imageUrl,
    });
    
    await newArticle.save();

    res.status(201).json({ message: "Article created", article: newArticle });
  } catch (err) {
    console.error("Add Article Error:", err);
    res
      .status(500)
      .json({ message: "Error adding article", error: err.message });
  }
};
/****************************************************************************************/
/****************************************************************************************/
