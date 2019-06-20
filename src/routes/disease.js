const router = require("express").Router();
const auth = require("../auth/auth");
const diseaseController = require("../controller/diseaseController");
router.get("/diseases", auth, diseaseController.getDiseases);
router.get("/disease/:disease_id", auth, diseaseController.getDisease);
router.post("/diseases", auth, diseaseController.addDiseases);
router.patch("/disease/:disease_id", auth, diseaseController.updateDisease);
module.exports = router;