require("dotenv").config()
const mongoose = require("mongoose");
const mongoURL =process.env.CONNECTION_STRING;

// const port = 3005

const userDatabase = mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    isConnected = true;
    console.log("database connected.");
  });

module.exports = userDatabase;
