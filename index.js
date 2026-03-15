const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const { error } = require("console");
const Post = require("./models/post");

const mongoose = require("mongoose");
const post = require("./models/post");
mongoose
    .connect("mongodb://127.0.0.1:27017/mystudyboard")
    .then(() => {
        console.log("Mongodb接続完了");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log("METHOD:", req.method, "URL:", req.url);
    next();
});

//投稿一覧
app.get("/posts", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render("posts/index", { posts });
});

//新規投稿画面
app.get("/posts/new", (req, res) => {
    res.render("posts/new", { error: null, post: {} });
});

//編集画面
app.get("/posts/:id/edit", async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).send("投稿が見つかりません");
    }

    res.render("posts/edit", { post, error: null });
});

//投稿詳細
app.get("/posts/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).send("投稿が見つかりません");
    }
    res.render("posts/show", { post });
});

//投稿作成
app.post("/posts", async (req, res) => {
    const { title, content, studyTime } = req.body;

    if (!title.trim() || !content.trim() || !studyTime) {
        return res.render("posts/new", {
            error: "すべて入力してください",
            post: req.body,
        });
    }

    await Post.create({
        title,
        content,
        studyTime,
    });

    res.redirect("/posts");
});

//更新
app.put("/posts/:id", async (req, res) => {
    const { title, content, studyTime } = req.body;

    //バリデーション
    if (!title.trim() || !content.trim() || !studyTime) {
        const post = await Post.findById(req.params.id);

        return res.render("posts/edit", {
            error: "すべて入力してください",
            post,
        });
    }

    await Post.findByIdAndUpdate(req.params.id, {
        title,
        content,
        studyTime,
    });

    res.redirect(`/posts/${req.params.id}`);
});

//削除
app.delete("/posts/:id", async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);

    res.redirect("/posts");
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("サーバーエラー");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
