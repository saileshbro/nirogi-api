const multer = require('multer');
const path = require('path');
const fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + req.user.user_id + '.' + file.originalname.toLowerCase().split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (fs.existsSync(`public/uploads/${file.fieldname + req.user.user_id + '.jpg'}`)) {
            fs.unlinkSync(`public/uploads/${file.fieldname + req.user.user_id + '.jpg'}`);
        }
        if (fs.existsSync(`public/uploads/${file.fieldname + req.user.user_id + '.png'}`)) {
            fs.unlinkSync(`public/uploads/${file.fieldname + req.user.user_id + '.png'}`);
        }
        if (fs.existsSync(`public/uploads/${file.fieldname + req.user.user_id + '.jpeg'}`)) {
            fs.unlinkSync(`public/uploads/${file.fieldname + req.user.user_id + '.jpeg'}`);
        }
        const ext = path.extname(file.originalname.toLowerCase());
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(({
                error: "Only images are allowed"
            }));
        }
        callback(null, true);
    },
}).single('avatar');
const router = require("express").Router();
const auth = require("../auth/auth");
const profileController = require("../controller/profileController");
router.get('/users', auth, profileController.getProfiles);
router.get('/users/me', auth, profileController.myProfile);
router.patch('/users/me', auth, profileController.updateProfile);
router.patch('/users/me/avatar', auth, upload, profileController.updateImage, (err, req, res, next) => {
    if (err) {
        return res.status(500).send({
            error: "err.error"
        });
    }
});
router.get('/users/:user_id', auth, profileController.viewProfile);
module.exports = router;