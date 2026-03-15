const Post = require("../models/post");

//投稿一覧
exports.getPosts = async (req, res) => {
    const keyword = req.query.keyword;

    let posts;

    if (keyword) {
        posts = await Post.find({
            title: { $regex: keyword, $options: "i" },
        });
    } else {
        posts = await Post.find().sort({ createdAt: -1 });
    }

    res.render("posts/index", { posts });
};

//新規投稿画面
exports.getNewPost = (req, res) => {
    res.render("posts/new");
};

//編集画面
exports.getEditPost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).send("投稿が見つかりません");
    }

    res.render("posts/edit", { post, error: null });
};

//投稿詳細
exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).send("投稿が見つかりません");
    }
    res.render("posts/show", { post });
};

//投稿作成
exports.createPost = async (req, res) => {
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
};

//更新
exports.updatePost = async (req, res) => {
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
};

//削除
exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);

    res.redirect("/posts");
};
