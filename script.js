const { Builder, By, Key, until } = require('selenium-webdriver');
const csv = require('fast-csv');
const fs = require('fs');
const { writeToPath } = require('@fast-csv/format');
const { ERROR, OPERATION } = require('./utils');

// const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { createReadStream, createWriteStream } = require('fs');
const { LogManager } = require('selenium-webdriver/lib/logging');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const { ENTER, CONTROL, DELETE } = Key;

const main2 = async () => {
  let driver;
  driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().maximize();
  await driver.get('https://www.google.com');
  await driver.findElement(By.name('q')).sendKeys('leetcode', ENTER);

  const links = await driver.findElements(By.className('yuRUbf'));
  links[0].click();

  const signUp = await driver.wait(
    until.elementLocated(By.css('a.sign-up-btn'))
  );

  signUp.sendKeys(Key.ENTER);

  const userName = await driver.wait(until.elementLocated(By.name('username')));
  userName.sendKeys('!234#@#');
  await driver.findElement(By.name('password1')).sendKeys('12345678a');
  await driver.findElement(By.name('password2')).sendKeys('1234');
  await driver
    .findElement(By.name('email'))
    .sendKeys('test-selenium@mailinator.com');

  await driver
    .findElement(By.css(`button[data-cy="sign-up-btn"]`))
    .sendKeys(ENTER);

  //   await setTimeout(async () => {
  //     let userName = await driver.findElement(By.name('username'));
  //     userName.sendKeys(CONTROL + 'a');
  //     userName.sendKeys(DELETE);
  //     userName.sendKeys('test-selenium1');

  //     let password2 = await driver.findElement(By.name('password2'));
  //     password2.sendKeys(CONTROL + 'a');
  //     password2.sendKeys(DELETE);
  //     password2.sendKeys('12345678a');

  //     let email = await driver.findElement(By.name('email'));
  //     email.sendKeys(CONTROL + 'a');
  //     email.sendKeys(DELETE);
  //     email.sendKeys('test-selenium1@mailinator.com');

  //     await driver
  //       .findElement(By.css(`button[data-cy="sign-up-btn"]`))
  //       .sendKeys(ENTER);

  //     await setTimeout(async () => {
  //       let password1 = await driver.findElement(By.name('password1'));
  //       password1.sendKeys(CONTROL + 'a');
  //       password1.sendKeys(DELETE);
  //       password1.sendKeys('123frwewf78@Tca');

  //       let password2 = await driver.findElement(By.name('password2'));
  //       password2.sendKeys(CONTROL + 'a');
  //       password2.sendKeys(DELETE);
  //       password2.sendKeys('123frwewf78@Tca');

  //       await driver
  //         .findElement(By.css(`button[data-cy="sign-up-btn"]`))
  //         .sendKeys(ENTER);
  //     }, 4000);
  //   }, 4000);
};

const main = async () => {
  // const values = await readFile();
  const url = './input/add.csv';
  const data = await readFile(url);

  console.log('VALUES : ', data);

  console.log('START');
  let driver;
  driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().maximize();
  await driver.get('https://testsheepnz.github.io/BasicCalculator.html');
  //   await driver.findElement(By.name('q')).sendKeys('leetcode', ENTER);
  const buildVersion = await driver.wait(
    until.elementLocated(By.name('selectBuild'))
  );
  const num1 = await driver.findElement(By.name('number1'));
  const num2 = await driver.findElement(By.name('number2'));
  const ans = await driver.findElement(By.name('numberAnswer'));
  // const res = await ans.getText();

  //   const operation = await driver.findElement(By.name('selectOperation'));
  const op = await driver.findElement(By.id('selectOperationDropdown'));

  // const operation = await driver.wait(
  //   until.elementLocated(By.id('selectOperationDropdown'))
  // );
  let calc = await driver.findElement(By.id('calculateButton'));
  let calcForm = await driver.findElement(By.id('calcForm'));
  let clear = await driver.findElement(By.id('clearButton'));
  const err = await driver.findElement(By.id('errorMsgField'));
  const intCheck = await driver.findElement(By.name('intSelection'));

  await buildVersion.sendKeys('3');
  await intCheck.click();

  // await calculate(driver, num1, num2, calc, ans, clear, '---12', 3);
  const { ADD, SUBTRACT, MULTIPLY, DIVIDE, CONCATENATE } = OPERATION;

  const result = [];
  let totalPass = 0;
  let totalFail = 0;
  let totalCase = 0;

  for (const item of data) {
    // console.log(await err.isDisplayed());
    const { pass, res } = await calculate(
      driver,
      op,
      num1,
      num2,
      calc,
      ans,
      err,
      clear,
      DIVIDE,
      item[0],
      item[1]
    );
    // console.log(pass);
    totalCase++;
    if (pass === 'PASSED') {
      totalPass++;
    }
    if (pass === 'FAILED') {
      totalFail++;
    }
    result.push({ pass, res });
  }
  const path = `output/add.csv`;
  // const outputData = result.map((item) => ({
  //   pass: item
  // }));
  // const options = { headers: true, quoteColumns: true };

  writeToPath(path, result)
    .on('error', (err) => console.error(err))
    .on('finish', () => console.log('Done writing.'));
  console.log(result);

  console.log('Total case : ', totalCase);
  console.log('Total passed : ', totalPass);
  console.log('Total failed : ', totalFail);

  console.log('DONE');
  //   driver.quit();
};

const calculate = async (
  driver,
  op,
  num1,
  num2,
  calc,
  ans,
  err,
  clear,
  opVal,
  num1Val,
  num2Val
) => {
  const { NUM1_ERROR, NUM2_ERROR } = ERROR;

  await num1.clear();
  await num2.clear();
  await op.sendKeys(opVal);
  await num1.sendKeys(num1Val);
  await num2.sendKeys(num2Val);
  await calc.click();
  let res = await ans.getAttribute('value');
  console.log('RESULT: ', res);

  // await driver.wait(until.elementLocated(err));

  const hasError = await err.isDisplayed();
  let pass = 'PASSED';
  if (hasError) {
    pass = 'FAILED';
    const errMsg = await err.getText();
    res = errMsg;
    console.log('ERROR: ', errMsg);
    // console.log(errMsg === NUM1_ERROR);
  } else {
    console.log('PASS');
  }
  await driver.wait(until.elementIsEnabled(clear));
  await clear.click();
  return { pass, res };
};

const readFile = (url) =>
  new Promise((resolve) => {
    let returnList = [];
    csv
      .parseFile(url, { headers: false })
      .on('data', (data) => {
        // console.log(data);
        returnList.push(data);
      })
      .on('end', () => {
        resolve(returnList);
      });
  });

main();
