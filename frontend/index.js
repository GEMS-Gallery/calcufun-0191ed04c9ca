import { backend } from "declarations/backend";

const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentValue = "";
let operator = "";
let previousValue = "";

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        if (value >= "0" && value <= "9" || value === ".") {
            currentValue += value;
            display.value = currentValue;
        } else if (value === "+" || value === "-" || value === "*" || value === "/") {
            if (previousValue && currentValue) {
                calculate();
            }
            operator = value;
            previousValue = currentValue;
            currentValue = "";
        } else if (value === "=") {
            if (previousValue && currentValue) {
                calculate();
            }
        }
    });
});

async function calculate() {
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;

    try {
        switch (operator) {
            case "+":
                result = await backend.add(prev, current);
                break;
            case "-":
                result = await backend.subtract(prev, current);
                break;
            case "*":
                result = await backend.multiply(prev, current);
                break;
            case "/":
                const divisionResult = await backend.divide(prev, current);
                if (divisionResult === null) {
                    throw new Error("Division by zero");
                }
                result = divisionResult;
                break;
        }

        display.value = result;
        previousValue = result.toString();
        currentValue = "";
    } catch (error) {
        display.value = "Error";
        previousValue = "";
        currentValue = "";
    }
}