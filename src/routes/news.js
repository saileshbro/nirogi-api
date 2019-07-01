const router = require("express").Router();
const auth = require("../auth/auth");
const newsController = require("../controller/newsController");
router.get("/news", newsController.getAllNews);
router.get("/news/:news_id", newsController.getNewsItem);
router.post("/news", newsController.addNews);
module.exports = router;
