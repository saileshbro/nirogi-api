const router = require('express').Router();
const tipsController = require("../controller/tipsController");
router.post('/food', tipsController.addFood);
router.post('/disease/foods', tipsController.addToDisease);
router.get("/tips/diseases", tipsController.getDiseases);
router.get("/tips/disease/:disease_id", tipsController.getTips);
module.exports = router;