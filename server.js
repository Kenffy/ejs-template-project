const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5001;
console.log(process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// static files
app.use(express.static("assets"));
app.use("/images", express.static(__dirname + "assets/images"));

app.use(methodOverride("_method"));
app.use("/articles", articleRouter);

app.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("server is listening to port: " + PORT);
});
