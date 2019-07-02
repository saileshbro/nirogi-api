const router = require("express").Router();
const auth = require("../auth/auth");
const drugController = require("../controller/drugController");
router.get("/drugs/common", auth, drugController.getCommonDrugs);
router.get("/drug/:genericName", auth, drugController.getDrug);
router.get("/drugs/search", auth, drugController.searchDrugs);
module.exports = router;
