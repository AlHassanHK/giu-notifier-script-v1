const sgMail = require("@sendgrid/mail");
// require('dotenv').config()
// dotenv.config({ path: "./config.env" });
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

sgMail.setApiKey("deleted");


const numericalToLetter = {
  "0.7":"A+",
  "1":"A",
  "1.3":"A-",
  "1.7":"B+",
  "2":"B",
  "2.3":"B-",
  "2.7":"C+",
  "3":"C",
  "3.3":"C-",
  "3.7":"D+",
  "4":"D",
  "5":"F/FF"
}

const generateEmailText = grades => {
  let text = "";
  for (let course in grades) {
    text += `${course} : ${grades[course]} | ${numericalToLetter[grades[course]]}  \n`;
  }
  return text;
};

exports.sendGradeEmail = (email, newGrades) => {
  const message = {
    to: email,
    from: "giurabbitmart@gmail.com",
    subject: "You have new grades",
    text: generateEmailText(newGrades)
  };
  return sgMail
    .send(message)
    .then(res => console.log(res))
    .catch(error => console.log(error));
};
