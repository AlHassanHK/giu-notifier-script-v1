const express = require("express");
//require controller here
const router = express.Router();

router.get("/", (req, res) =>{
    res.render("./views/frontpage.ejs")
}) 
  

module.exports = router;