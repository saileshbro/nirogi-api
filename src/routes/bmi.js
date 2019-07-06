const router = require("express").Router();
const bmiController = require("../controller/bmiController");
const auth = require("../auth/auth");
router.post("/user/bmi", auth, bmiController.addBmiRecord);
router.get("/user/bmi", auth, bmiController.getBmiHistory);
module.exports = router;
