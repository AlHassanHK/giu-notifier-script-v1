// const app = require("./app");

const mongoose = require("mongoose");
const mongoURL =
  "mongodb+srv://Admin:zjop3nANJMQmrddT@cluster0.xc1pk.mongodb.net/users?retryWrites=true&w=majority";

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
