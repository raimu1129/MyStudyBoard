const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/posts", postController.getPosts);
router.get("/posts/new", postController.getNewPost);
router.get("/posts/:id", postController.getPost);
router.get("/posts/:id/edit", postController.getEditPost);

router.post("/posts", postController.createPost);
router.put("/posts/:id", postController.updatePost);
router.delete("/posts/:id", postController.deletePost);

module.exports = router;
