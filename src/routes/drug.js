const router = require("express").Router();
const auth = require("../auth/auth");
const drugController = require("../controller/drugController");
router.get("/drugs/common", drugController.getCommonDrugs);
router.get("/drug/:genericName", drugController.getDrug);
router.get("/drugs/search", drugController.searchDrugs);
module.exports = router;
