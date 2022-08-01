require("../mongo");

const puppeteer = require("puppeteer");
const user = require("../User");
const email = require("./utils/email");

async function getTranscript(username, password) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.authenticate({
    username: username,
    password: password
  });
  await page.goto("https://portal.giu-uni.de", { timeout: 0 });
  const transcript = await page.$("#ContentPlaceHolder1_lnk_transcript");
  await transcript.click();
  await page.waitForSelector("#ContentPlaceHolder1_stdYrLst");
  await page.evaluate(() => {
    const yearOptions = document.getElementById("ContentPlaceHolder1_stdYrLst");
    if (yearOptions.disabled === true) {
      yearOptions.disabled = false;
      console.log("Evaluations needed"); //to be added in email
    }
  });
  await page.select("#ContentPlaceHolder1_stdYrLst", "19");
  await page.waitForSelector("[id=Table4]");
  const gradeString = await page.evaluate(() => {
    const tables = $("[id=Table4]").toArray();
    const Spring2022 = tables[2];

    let gradeMap = {};
    for (var i = 0, row; (row = Spring2022.rows[i]); i++) {
      if (i <= 1 || i === Spring2022.rows.length - 1) {
        continue;
      }
      let value = row.innerText;
      let filteredValue = value.split("\t");
      let courseName = filteredValue[1];
      let courseGrade = filteredValue[2];
      gradeMap[courseName] = courseGrade;
    }
    return JSON.stringify(gradeMap);
  });
  const gradeObject = JSON.parse(gradeString);
  await browser.close();
  return gradeObject;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getDifferentCourses(currentRecord, newRecord) {
  let differentCourses = { ...newRecord };
  for (let course in currentRecord) {
    if (currentRecord[course] === newRecord[course]) {
      delete differentCourses[course];
    }
  }
  return differentCourses;
}

async function checkAndNotifyUser(userObject, userEmail) {
  const oldRecord = userObject.grades;
  const newRecord = await getTranscript(
    userObject.username,
    userObject.password
  );
  const differentCourses = getDifferentCourses(oldRecord, newRecord);
  const databaseValue = { ...oldRecord };
  if (isEmpty(differentCourses)) {
    console.log("Courses Unchanged.");

    return;
  }
  email.sendGradeEmail(userEmail, differentCourses);

  Object.assign(databaseValue, differentCourses);
  await user.findOneAndUpdate(
    { username: userObject.username },
    { grades: databaseValue }
  );
}



const checkAllUsers = async () => {
  const allUsers = await user.find({});
  if (isEmpty(allUsers)) {
    console.log("database empty. checking again in 30 seconds.");
    return;
  }
  for (let user of allUsers) {
    await checkAndNotifyUser(user, user.email);
  }
};

const start = (async () => {
  checkAllUsers();
  setInterval(checkAllUsers, 2700000);
})();
