require("../mongo");

const puppeteer = require("puppeteer");
const user = require("../User");
const email = require("./utils/email");
const decrypt = require("../decrypt");

async function getTranscript(username, password, encryptedPassword) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.authenticate({
    username: username,
    password: password
  });
  await page.goto("https://portal.giu-uni.de", { timeout: 0 });
  const transcript = await page.$("#ContentPlaceHolder1_lnk_transcript");
  // if (transcript === null) {
  //   const currentDate = new Date();
  //   console.log("password:", password, "type:", typeof password);
  //   throw new Error(`page is not rendered due to wrong credentials or slow internet connection. @ ${currentDate}`);
  // }
  try {
    await transcript.click();
  } catch (error) {
    throw new Error("page is not rendered");
  }
  await page.waitForSelector("#ContentPlaceHolder1_stdYrLst");
  await page.evaluate(() => {
    const yearOptions = document.getElementById("ContentPlaceHolder1_stdYrLst");
    if (yearOptions.disabled === true) {
      yearOptions.disabled = false;
      console.log("Evaluations needed"); //to be added in email
    }
  });
  await page.select("#ContentPlaceHolder1_stdYrLst", "20");
  await page.waitForSelector("[id=Table4]");
  const gradeString = await page.evaluate(() => {
    const tables = $("[id=Table4]").toArray();
    const Winter2023 = tables[0];

    let gradeMap = {};
    for (var i = 0, row; (row = Winter2023.rows[i]); i++) {
      if (i <= 1 || i === Winter2023.rows.length - 1) {
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
  const decryptedPassword = decrypt(userObject.password);

  const newRecord = await getTranscript(
    userObject.username,
    decryptedPassword
  );

  const differentCourses = getDifferentCourses(oldRecord, newRecord);
  const databaseValue = { ...oldRecord };
  if (isEmpty(differentCourses)) {
    const currentDate = new Date();
    console.log("\x1b[32m Courses Unchanged\x1b[0m", `| \x1b[33m${userObject.username}\x1b[0m \x1b[90m @\x1b[0m \x1b[34m${currentDate} \x1b[0m`);
    return;
  }
  email.sendGradeEmail(userEmail, differentCourses);
  const date = new Date();
  console.log(`\x1b[32m EMAIL SENT:\x1b[0m \x1b[35m${userObject.username}\x1b[0m | \x1b[32m ADDRESS:\x1b[0m \x1b[35m${userEmail}\x1b[0m @ \x1b[31m${date}\x1b[0m`)
  Object.assign(databaseValue, differentCourses);
  await user.findOneAndUpdate(
    { username: userObject.username },
    { grades: databaseValue }
  );
}



const checkAllUsers = async () => {
  const promiseArray = [];
  const allUsers = await user.find({});
  if (isEmpty(allUsers)) {
    console.log("database empty. checking again in 30 seconds.");
    return;
  }
  for (let user of allUsers) {
    promiseArray.push(checkAndNotifyUser(user, user.email));
  }
  Promise.all(promiseArray);
};

const start = (async () => {
  checkAllUsers();
  setInterval(checkAllUsers, 300000);
})();
