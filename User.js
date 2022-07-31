const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  grades: {
    type: Object,
    default:{},
    required: true,
  },
});

// userSchema.methods.getUserPassword = async () => {
//   return this.password;
// };

const User = mongoose.model("users", userSchema);

module.exports = User;
