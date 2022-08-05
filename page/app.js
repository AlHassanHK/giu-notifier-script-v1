const express = require("express");
const registrationRoutes = require("./routes/registrationRoutes")
const app = express();
require("../mongo");

const morgan = require("morgan");
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  }); 
   
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.use("/", registrationRoutes)

module.exports = app;