function getCurrentNumber() {
    if (currentExpression === "") {
        return "";
    }
    if (Number.isFinite(Number(currentExpression))) {
        return currentExpression;
    }
    // Match to last number if it exists
    let lastNumber = currentExpression.match(/\d+[.]?\d*$/);
    if (lastNumber) {
        return lastNumber[0];
    }
    return "";
}

function validNumberAppend(value) {
    if (Number(value) > 0) {
        return true;
    }
    let currentNumber = getCurrentNumber();
    if (currentNumber === "0" && value === "0") {
        return false;
    }
    return true;
}

function appendNumber(value) {
    if (!validNumberAppend(value)) {
        return;
    }
    if (currentExpression === "0") {
        currentExpression = "";
    }
    currentExpression += value;
    expressionDisplay.textContent = currentExpression;
}

function pressNumber(e) {
    appendNumber(e.target.textContent);
    calculate();
}

function pressReset() {
    resultDisplay.textContent = "";
    expressionDisplay.textContent = "";
    currentExpression = "";
}

function pressBackspace(e) {
    console.log(e.target.textContent);
}

function pressMod(e) {
    console.log(e.target.textContent);
}

function pressExponent(e) {
    console.log(e.target.textContent);
}

function pressDivide(e) {
    console.log(e.target.textContent);
}

function pressMultiply(e) {
    console.log(e.target.textContent);
}

function pressSubtract(e) {
    console.log(e.target.textContent);
}

function pressAdd(e) {
    console.log(e.target.textContent);
}

function pressCalculate(e) {
    console.log(e.target.textContent);
}

function pressPeriod(e) {
    console.log(e.target.textContent);
}

function processKey(e) {
    if (Number.isInteger(Number(e.key))) {
        appendNumber(e.key);
        calculate();
    } else if (e.key === "Backspace") {
        console.log(e.key);
    } else if (e.key === "%") {
        console.log(e.key);
    } else if (e.key === "^") {
        console.log(e.key);
    } else if (e.key === "/") {
        console.log(e.key);
    } else if (e.key === "*") {
        console.log(e.key);
    } else if (e.key === "-") {
        console.log(e.key);
    } else if (e.key === "+") {
        console.log(e.key);
    } else if (e.key === "=") {
        console.log(e.key);
    } else if (e.key === ".") {
        console.log(e.key);
    }
}

function calculate() {
    resultDisplay.textContent = currentExpression;
}

let currentExpression = "";

const numberButtons = document.querySelectorAll(".number");
const resetButton = document.querySelector("#reset");
const backspaceButton = document.querySelector("#backspace");
const modButton = document.querySelector("#mod");
const exponentButton = document.querySelector("#exponent");
const divideButton = document.querySelector("#divide");
const multiplyButton = document.querySelector("#multiply");
const subtractButton = document.querySelector("#subtract");
const addButton = document.querySelector("#add");
const equalButton = document.querySelector("#equal");
const periodButton = document.querySelector("#period");
const resultDisplay = document.querySelector(".result");
const expressionDisplay = document.querySelector(".expression");

numberButtons.forEach(number => number.addEventListener("click", pressNumber));
resetButton.addEventListener("click", pressReset);
backspaceButton.addEventListener("click", pressBackspace);
modButton.addEventListener("click", pressMod);
exponentButton.addEventListener("click", pressExponent);
divideButton.addEventListener("click", pressDivide);
multiplyButton.addEventListener("click", pressMultiply);
subtractButton.addEventListener("click", pressSubtract);
addButton.addEventListener("click", pressAdd);
equalButton.addEventListener("click", pressCalculate);
periodButton.addEventListener("click", pressPeriod);

window.addEventListener("keydown", processKey);