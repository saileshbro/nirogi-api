const router = require("express").Router();
const userController = require("../controller/userController");
const auth = require("../auth/auth");
router.post("/users/signup", userController.signup);
router.post("/users/login", userController.login);
router.post("/users/forgot", userController.forgot);
router.post("/users/logout", auth, userController.logout);
router.post("/users/changepw", auth, userController.changepw);
module.exports = router;