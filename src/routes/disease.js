const router = require("express").Router();
const auth = require("../auth/auth");
const diseaseController = require("../controller/diseaseController");
router.get("/diseases", auth, diseaseController.getDiseases);
router.post("/diseases", auth, diseaseController.addDiseases);
module.exports = router;
