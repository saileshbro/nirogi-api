const router = require("express").Router();
const auth = require("../auth/auth");
const symptomController = require("../controller/symptomController");
router.get("/symptoms", auth, symptomController.getSymptoms);
router.get("/symptoms/top", auth, symptomController.topSymptoms);
router.get("/symptom/:symptom_id", auth, symptomController.getSymptom);
router.post("/symptoms", auth, symptomController.addSymptoms);
router.patch("/symptom/:symptom_id", auth, symptomController.updateSymptom);
module.exports = router;