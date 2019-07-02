const router = require("express").Router();
const auth = require("../auth/auth");
const postController = require("../controller/postController");
router.get("/posts", auth, postController.viewPosts);
router.get("/posts/me", auth, postController.viewMyPosts);
router.post("/posts", auth, postController.createPost);
router.get("/post/:post_id", auth, postController.viewPost);
router.post("/post/:post_id/upvote", auth, postController.upVotePost);
router.post("/post/:post_id/downvote", auth, postController.downVotePost);
router.patch("/post/:post_id", auth, postController.updatePost);
router.delete("/post/:post_id", auth, postController.deletePost);
router.post("/post/:post_id/comment", auth, postController.createComment);
router.get("/post/:post_id/comments", auth, postController.getComments);
router.get(
  "/post/:post_id/comment/:comment_id",
  auth,
  postController.getComment
);
router.patch(
  "/post/:post_id/comment/:comment_id",
  auth,
  postController.editComment
);
router.delete(
  "/post/:post_id/comment/:comment_id",
  auth,
  postController.deleteComment
);
router.post(
  "/post/:post_id/comment/:comment_id/upvote",
  auth,
  postController.upVoteComment
);
router.post(
  "/post/:post_id/comment/:comment_id/downvote",
  auth,
  postController.downVoteComment
);
module.exports = router;
