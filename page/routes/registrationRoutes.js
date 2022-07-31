const express = require("express");
//require controller here
const router = express.Router();
const controller = require("../controller/userController");


router.get("/registration", controller.renderMainView);

router.route("/registration").post(controller.saveUser);



module.exports = router;
