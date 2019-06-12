const router = require("express").Router();
const userController = require("../controller/userController");
const auth = require("../auth/auth");
router.get("/users", auth, userController.getUsers);
router.post("/users/signup", userController.signup);
router.post("/users/login", userController.login);
router.post("/users/logout", auth, userController.logout);
module.exports = router;
