const express = require("express");
const Article = require("./../models/article");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadFile = multer({ storage: storage });

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

router.post(
  "/",
  uploadFile.single("file"),
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  uploadFile.single("file"),
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    console.log(req.file);
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    article.picture = req.file ? req.file.filename : "default.jpg";
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
