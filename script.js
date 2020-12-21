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

const { ADD, SUBTRACT, MULTIPLY, DIVIDE, CONCATENATE } = OPERATION;

// opVal: operation
// buildVer: build version
const test = async (opVal) => {
  // let buildVer = '0';

  const finalResults = []; // Store result with total pass, fail, run
  const buildVers = [0, 1, 2, 3, 4, 5, 6, 7, 9]; // build version
  // const buildVers = [8]; // build version
  // const buildVers = []; // build version
  // const buildVers = [0];
  let inputPath = ''; // input file
  let outputPath = ''; // output file

  switch (opVal) {
    case ADD: {
      inputPath = './input/add.csv';
      outputPath = './output/add.csv';
      break;
    }
    case SUBTRACT: {
      inputPath = './input/subtract.csv';
      outputPath = './output/subtract.csv';
      break;
    }
    case MULTIPLY: {
      inputPath = './input/multiply.csv';
      outputPath = './output/multiply.csv';
      break;
    }
    case DIVIDE: {
      inputPath = './input/divide.csv';
      outputPath = './output/divide.csv';
      break;
    }
    case CONCATENATE: {
      inputPath = './input/concatenate.csv';
      outputPath = './output/concatenate.csv';
      break;
    }
    default:
      break;
  }

  try {
    const data = await readFile(inputPath); // read input data
    let outputData = await readFile(outputPath); // read output data

    outputData = outputData.map((item) => item[0]); // get valid data

    console.log('START');

    let driver;
    driver = await new Builder().forBrowser('chrome').build(); // initiate Chrome browser's driver
    await driver.manage().window().maximize(); // maximize window
    await driver.get('https://testsheepnz.github.io/BasicCalculator.html'); // open link
    const buildVersion = await driver.wait(
      until.elementLocated(By.name('selectBuild'))
    ); // build element
    const num1 = await driver.findElement(By.name('number1')); // number 1 element
    const num2 = await driver.findElement(By.name('number2')); // number 2 element
    const ans = await driver.findElement(By.name('numberAnswer')); // answer element
    const op = await driver.findElement(By.id('selectOperationDropdown')); // operation element

    let calc = await driver.findElement(By.id('calculateButton')); // calculate button element
    // let calcForm = await driver.findElement(By.id('calcForm'));
    let clear = await driver.findElement(By.id('clearButton')); // clear button element
    const err = await driver.findElement(By.id('errorMsgField')); // error message element
    const intCheck = await driver.findElement(By.name('intSelection')); // integer only element

    const result = [];
    let totalPass = 0;
    let totalFail = 0;
    let totalCase = 0;

    // loop every build
    for (const build of buildVers) {
      await buildVersion.sendKeys(build.toString());
      let index = 0;
      let subIndex = 0;

      // loop every input data
      for (const item of data) {
        if (subIndex === 13) {
          await intCheck.click(); // Test integer only case
        }
        const { pass, res } = await calculate(
          driver,
          op,
          num1,
          num2,
          calc,
          ans,
          err,
          clear,
          opVal,
          item[0], // number 1
          item[1], // number 2
          outputData[index]
        );
        totalCase++;
        if (pass === 'PASSED') {
          totalPass++;
        }
        if (pass === 'FAILED') {
          totalFail++;
        }
        result.push({ pass, res });
        subIndex++;
        index++;
      }

      let resultPath = '';

      switch (opVal) {
        case ADD: {
          resultPath = `./result/add/add(${build}).csv`;
          break;
        }
        case SUBTRACT: {
          resultPath = `./result/subtract/subtract(${build}).csv`;
          break;
        }
        case MULTIPLY: {
          resultPath = `./result/multiply/multiply(${build}).csv`;
          break;
        }
        case DIVIDE: {
          resultPath = `./result/divide/divide(${build}).csv`;
          break;
        }
        case CONCATENATE: {
          resultPath = `./result/concatenate/concatenate(${build}).csv`;
          break;
        }
        default:
          break;
      }

      writeToPath(resultPath, result)
        .on('error', (err) => console.error(err))
        .on('finish', () => console.log('Done writing.'));
      console.log(result);

      console.log('Total case : ', totalCase);
      console.log('Total passed : ', totalPass);
      console.log('Total failed : ', totalFail);

      finalResults.push({
        buildVersion: build,
        totalCase,
        totalPass,
        totalFail
      });

      totalPass = 0;
      totalFail = 0;
      totalCase = 0;
    }

    console.log('DONE WITHOUT ERROR');
  } catch (error) {
    console.log(error);
    console.log('DONE WITH ERROR');
  } finally {
    console.log(finalResults);
  }
  // driver.quit();
  // return { totalCase, totalPass, totalFail };
};

// parameter: References to all element in DOM
// opVal: Operation value
// num1Val: Number 1 value
// num2Val: Number 2 value
// expected: Output value
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
  num2Val,
  expected
) => {
  const { NUM1_ERROR, NUM2_ERROR } = ERROR;

  // clear all input
  await num1.clear();
  await num2.clear();

  // set operation
  await op.sendKeys(opVal);

  // set 2 number
  await num1.sendKeys(num1Val);
  await num2.sendKeys(num2Val);

  // click calculate
  await calc.click();

  // get answer
  let res = await ans.getAttribute('value');
  console.log('RESULT: ', res);

  // check if errer exists
  const hasError = await err.isDisplayed();
  let pass = 'PASSED';

  if (hasError) {
    const errMsg = await err.getText();
    if (expected !== errMsg) {
      pass = 'FAILED';
    }
    res = errMsg;
  } else if (Number(res) === Number(expected)) {
    // Number compare (Add, Subtract, Multiply, Divide)
    console.log('PASS');
  } else if (res === expected) {
    // String compare (Concatenate)
    console.log('PASS');
  } else {
    console.log('FAILED');
    pass = 'FAILED';
  }
  // console.log(res, expected);
  await driver.wait(until.elementIsEnabled(clear));
  await clear.click();
  return { pass, res };
};

// read file from url
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

// test(ADD);
// test(SUBTRACT);
// test(MULTIPLY);
test(DIVIDE);
// test(CONCATENATE);
