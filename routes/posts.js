const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.get("/", postController.getPosts);

router.get("/new", postController.getNewPost);

router.post("/", postController.createPost);

router.get("/:id", postController.getPost);

router.get("/:id/edit", postController.getEditPost);

router.put("/:id", postController.updatePost);

router.delete("/:id", postController.deletePost);

module.exports = router;
