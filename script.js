
function appendNumber(e) {
    let integer = Number(e.target.textContent);
    console.log(integer);
}

function reset(e) {
    console.log(e.target.textContent);
}

function backspace(e) {
    console.log(e.target.textContent);
}

function mod(e) {
    console.log(e.target.textContent);
}

function exponentiate(e) {
    console.log(e.target.textContent);
}

function divide(e) {
    console.log(e.target.textContent);
}

function multiply(e) {
    console.log(e.target.textContent);
}

function subtract(e) {
    console.log(e.target.textContent);
}

function add(e) {
    console.log(e.target.textContent);
}

function calculate(e) {
    console.log(e.target.textContent);
}

function appendPeriod(e) {
    console.log(e.target.textContent);
}

function processPressedKey(e) {
    if (Number.isInteger(Number(e.key))) {
        console.log(Number(e.key));
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

numberButtons.forEach(number => number.addEventListener("click", appendNumber));
resetButton.addEventListener("click", reset);
backspaceButton.addEventListener("click", backspace);
modButton.addEventListener("click", mod);
exponentButton.addEventListener("click", exponentiate);
divideButton.addEventListener("click", divide);
multiplyButton.addEventListener("click", multiply);
subtractButton.addEventListener("click", subtract);
addButton.addEventListener("click", add);
equalButton.addEventListener("click", calculate);
periodButton.addEventListener("click", appendPeriod);

window.addEventListener("keydown", processPressedKey);