const router = require("express").Router();
const auth = require("../auth/auth");
const provinceController = require("../controller/provinceController");
router.get("/provinces", provinceController.getProvinces);
router.post("/provinces", provinceController.addProvince);
router.get("/province/:province_id", provinceController.getProvince);
module.exports = router;
