const express = require("express");
//require controller here
const router = express.Router();


router.get("/", (req, res) => {
  res.render("frontpage.ejs");
});

router.post("/save-credentials", (req, res)=>{
    
    res.json({username:req.body.username,password:req.body.password, email:req.body.email});
});



module.exports = router;
