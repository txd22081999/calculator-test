const { Builder, By, Key, until } = require('selenium-webdriver');
const csv = require('fast-csv');
const a = require('selenium-webdriver');

// const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { createReadStream } = require('fs');

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
  const res = await ans.getText();

  //   const operation = await driver.findElement(By.name('selectOperation'));
  //   const operation = await driver.findElement(By.id('selectOperationDropdown'));
  const operation = await driver.wait(
    until.elementLocated(By.id('selectOperationDropdown'))
  );
  let calculate = await driver.findElement(By.id('calculateButton'));
  let calcForm = await driver.findElement(By.id('calcForm'));
  let clear = await driver.findElement(By.id('clearButton'));
  //   const calculate = await driver.wait(
  //     until.elementLocated(By.id('calculateButton'))
  //   );
  //   console.log(await operation.isEnabled())
  //   console.log(operation);
  await operation.sendKeys('2');
  await buildVersion.sendKeys('3');

  await num1.sendKeys(20);
  await num2.sendKeys(30);
  await calculate.click();
  console.log(await ans.getAttribute('value'));
  await driver.wait(until.elementIsEnabled(clear));
  //   console.log(await clear.isEnabled());
  await clear.click();

  await num1.clear();
  await num2.clear();
  await num1.sendKeys(11);
  await num2.sendKeys(22);
  await calculate.click();
  console.log(await ans.getAttribute('value'));
  await driver.wait(until.elementIsEnabled(clear));
  await clear.click();

  await num1.sendKeys(33);
  await num2.sendKeys(44);
  await calculate.click();
  console.log(await ans.getAttribute('value'));
  await driver.wait(until.elementIsEnabled(clear));
  await clear.click();

  //   await num1.sendKeys(33);
  //   await num2.sendKeys(44);
  //   await calculate.click();
  //   console.log(await ans.getAttribute('value'));

  console.log('DONE');
  //   driver.quit();
  //   console.log(buildVersion.value);
  //   console.log(buildVersion);
};

const readFile = async () => {
  const stream = createReadStream('./csv/file1.csv');
  await csv
    .parseStream(stream, { headers: false })
    .on('data', (data) => {
      console.log('One line of data', data);
    })
    .on('end', () => {
      console.log('done');
    });
  console.log('asd');
};

// readFile();
main();
