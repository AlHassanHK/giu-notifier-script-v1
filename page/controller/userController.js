const user = require("../../User");

exports.renderMainView = (req, res) => {
  res.render("frontpage.ejs");
};

exports.saveUser = async (req, res) => {
  try {
    await user.create(req.body);
    res.status(201).json({message:"successfully created user."});
  } catch (error) {
    res.status(400).json({error:error.message});
  }
};
