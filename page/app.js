const express = require("express");
const registrationRoutes = require("./routes/registrationRoutes")
const app = express();
require("../mongo");
const morgan = require("morgan");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.use("/", registrationRoutes)

module.exports = app;