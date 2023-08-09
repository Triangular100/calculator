function pressReset() {
    resultDisplay.textContent = "";
    expressionDisplay.textContent = "";
    currentExpression = "";
}

function pressNumber(e) {
    appendNumber(e.target.textContent);
    drawDisplay();
}

function appendNumber(value) {
    if (!validNumberAppend(value)) {
        return;
    }
    if (existsLastNumber() === "0") {
        currentExpression - removeLastDigit(currentExpression);
    }
    currentExpression += value;
    result = calculateExpression(currentExpression);
}

function validNumberAppend(value) {
    if (Number(value) > 0) {
        return true;
    }
    let lastNumber = existsLastNumber();
    if (lastNumber === "0" && value === "0") {
        return false;
    }
    return true;
}

function existsLastNumber() {
    // returns the last number if there is a last number
    if (currentExpression === "") {
        return "";
    }
    if (Number.isFinite(Number(currentExpression))) {
        return currentExpression;
    }
    // Match to last number if it exists
    let lastNumber = currentExpression.match(/\d*[.]?\d*$/);
    if (lastNumber) {
        return lastNumber[0];
    }
    return "";
}

function pressBackspace(e) {
    backspace();
}

function backspace() {
    if (currentExpression === "") {
        return;
    }
    // Either at a number or operator
    if (existsLastNumber()) {
        currentExpression = removeLastDigit(currentExpression);
    } else {
        currentExpression = removeLastOperator(currentExpression);
    }
    if (existsLastOperator()) {
        result = calculateExpression(removeLastOperator(currentExpression));
    } else {
        let lastNumber = existsLastNumber();
        if (lastNumber === ".") {
            result = calculateExpression(removeLastOperator(removeLastDigit(currentExpression)));
        } else {
            result = calculateExpression(currentExpression);
        }
    }
    drawDisplay();
}

function removeLastDigit(expression) {
    return expression.substring(0, expression.length - 1);
}

function removeLastOperator(expression) {
    return expression.substring(0, expression.length - 3);
}

function pressMod(e) {
    appendOperator("%");
}

function pressExponent(e) {
    appendOperator("^");
}

function pressDivide(e) {
    appendOperator("/");
}

function pressMultiply(e) {
    appendOperator("*");
}

function pressSubtract(e) {
    appendOperator("-");
}

function pressAdd(e) {
    appendOperator("+");
}

function appendOperator(operator) {
    if (currentExpression === "" && operator === "-") {
        currentExpression += `${operator}`;
        drawDisplay();
        return;
    }
    if (currentExpression === "") {
        return;
    }
    // Negative number needs digits (don't operate on negative sign)
    if (currentExpression === "-") {
        return;
    }
    if (existsLastOperator() === operator) {
        return;
    }
    // Floating point number needs digits (don't allow operation on .)
    let lastNumber = existsLastNumber();
    if (lastNumber === ".") {
        return;
    }
    // replace operator
    if (currentExpression !== "" && lastNumber === "") {
        currentExpression = removeLastOperator(currentExpression);
    }
    result = calculateExpression(currentExpression);
    currentExpression += ` ${operator} `;
    drawDisplay();
}

function existsLastOperator() {
    // Returns the the operator at the end if there is one at the end
    if (currentExpression === "") {
        return "";
    }
    if (existsLastNumber() !== "") {
        return "";
    }
    return currentExpression[currentExpression.length - 2];
}

function pressCalculate(e) {
    let lastNumber = existsLastNumber();
    if (lastNumber === "" || lastNumber === ".") {
        return;
    }
    result = "";
    currentExpression = calculateExpression(currentExpression);
    drawDisplay();
}

function pressPeriod(e) {
    addPeriod();
}

function addPeriod() {
    let lastNumber = existsLastNumber();
    if (lastNumber.includes(".")) {
        return;
    }
    currentExpression += ".";
    drawDisplay();
}

function processKey(e) {
    if (e.key === " ") {
        return;
    } else if (Number.isInteger(Number(e.key))) {
        appendNumber(e.key);
        drawDisplay();
    } else if (e.key === "Backspace") {
        backspace();
    } else if (e.key === "%") {
        appendOperator("%");
        drawDisplay();
    } else if (e.key === "^") {
        appendOperator("^");
        drawDisplay();
    } else if (e.key === "/") {
        appendOperator("/");
        drawDisplay();
    } else if (e.key === "*") {
        appendOperator("*");
        drawDisplay();
    } else if (e.key === "-") {
        appendOperator("-");
        drawDisplay();
    } else if (e.key === "+") {
        appendOperator("+");
        drawDisplay();
    } else if (e.key === "Enter") {
        pressCalculate();
    } else if (e.key === ".") {
        addPeriod();
    }
}

function drawDisplay() {
    expressionDisplay.textContent = currentExpression;
    resultDisplay.textContent = result;
}

function calculateExpression(expression) {
    if (expression === "" || expression === "-") {
        return "";
    }
    // Precedence: exponent, (multiplication, division, modulus), (add, subtract)
    while (expression.includes("^")) {
        expression = simplifyOn(expression, "^");
    }
    while (expression.includes("*") || expression.includes("/") || expression.includes("%")) {
        let operator = identifyFirstOperator(expression, ["*", "/", "%"]);
        expression = simplifyOn(expression, operator);
    }
    while (expression.includes("+") || expression.includes("-")) {
        if (Number.isFinite(Number(expression))) {
            // expression can be negative, like -3
            break;
        }
        // remove first digit to account for possibility of first number negative
        let operator = identifyFirstOperator(expression.substring(1), ["+", "-"]);
        expression = simplifyOn(expression, operator);
    }
    return String(Number(expression));
}

function identifyFirstOperator(expression, operators) {
    let first = "";
    let lowestIndex = Infinity;
    operators.forEach(operator => {
        let index = expression.indexOf(operator);
        if (index >= 0 && index < lowestIndex) {
            first = operator;
            lowestIndex = index;
        }
    });
    return first;
}

function simplifyOn(expression, operator) {
    let subterms = getFirstSubterms(expression, operator);
    let [num1, num2] = getNumbers(subterms, operator);
    let output = "";
    if (operator === "+") {
        output = num1 + num2;
    } else if (operator === "-") {
        output = num1 - num2;
    } else if (operator === "*") {
        output = num1 * num2;
    } else if (operator === "/") {
        output = num1 / num2;
    } else if (operator === "^") {
        output = Math.pow(num1, num2);
    } else if (operator === "%") {
        output = num1 % num2;
    }
    return expression.replace(subterms, output);
}

function getFirstSubterms(expression, operator) {
    // Account for negative sign if operator is a minus
    let minus = "";
    if (operator === "-" && expression[0] === "-") {
        expression = expression.substring(1);
        minus = "-";
    }

    // Format always has a space on each side of the operator
    let index = expression.indexOf(operator);
    let leftIndex = index - 2;
    let rightIndex = index + 2;

    while (leftIndex >= 0 && !(expression[leftIndex] === " ")) {
        leftIndex--;
    }
    while (rightIndex < expression.length && !(expression[rightIndex] === " ")) {
        rightIndex++;
    }

    return minus + expression.substring(leftIndex + 1, rightIndex);
}


function getNumbers(expression, operator) {
    let [num1, num2] = expression.split(` ${operator} `);
    return [Number(num1), Number(num2)];
}

let result = "";
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
