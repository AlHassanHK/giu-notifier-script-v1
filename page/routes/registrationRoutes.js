const express = require("express");
//require controller here
const router = express.Router();

function renderEJS(req, res){
    res.render("frontpage.ejs");
    
}


router.route("/").get(renderEJS);
  

module.exports = router;