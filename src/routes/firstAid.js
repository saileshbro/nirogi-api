const router = require("express").Router();
const auth = require("../auth/auth");
const firstAidController = require("../controller/firstAidController");
router.get("/firstaids", firstAidController.getFirstAids);
router.post("/firstaids", firstAidController.addFirstAid);
router.get("/firstaid/:first_aid_id", firstAidController.getFirstAid);
module.exports = router;
