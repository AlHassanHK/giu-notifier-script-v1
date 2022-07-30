const express = require("express");
const registrationRoutes = require("./routes/registrationRoutes")
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');


app.use("/registration-form", registrationRoutes)

module.exports = app;