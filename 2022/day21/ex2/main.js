import { input } from "../input.js";
const solvedMonkeys = new Map();
const operationMonkeys = new Map();
input.split("\n").forEach((line) => {
    let matchNumberMonkey = line.match(/^(....): (\d+)$/);
    let matchOperationMonkey = line.match(/^(....): (....) ([-+*/]) (....)$/);
    if (matchNumberMonkey) {
        let name = matchNumberMonkey[1];
        let number = parseInt(matchNumberMonkey[2]);
        if (name !== "humn") {
            solvedMonkeys.set(name, number);
        }
    }
    else if (matchOperationMonkey) {
        let name = matchOperationMonkey[1];
        let parent1 = matchOperationMonkey[2];
        let operation = matchOperationMonkey[3];
        let parent2 = matchOperationMonkey[4];
        if (name === "root")
            operation = "-";
        let monkey = {
            value1: parent1,
            value2: parent2,
            operation
        };
        operationMonkeys.set(name, monkey);
    }
});
// solving until we can't
let oldSize = undefined;
while (operationMonkeys.size != oldSize) {
    oldSize = operationMonkeys.size;
    for (const entry of operationMonkeys) {
        const name = entry[0];
        const monkey = entry[1];
        let v1 = monkey.value1;
        if (typeof v1 === "string" && solvedMonkeys.has(v1)) {
            v1 = solvedMonkeys.get(v1);
            monkey.value1 = v1;
        }
        let v2 = monkey.value2;
        if (typeof v2 === "string" && solvedMonkeys.has(v2)) {
            v2 = solvedMonkeys.get(v2);
            monkey.value2 = v2;
        }
        if (!(typeof v1 === "number" && typeof v2 === "number"))
            continue;
        let result;
        switch (monkey.operation) {
            case "+":
                result = v1 + v2;
                break;
            case "-":
                result = v1 - v2;
                break;
            case "*":
                result = v1 * v2;
                break;
            case "/":
                result = v1 / v2;
                break;
        }
        operationMonkeys.delete(name);
        solvedMonkeys.set(name, result);
    }
}
console.log(solvedMonkeys);
console.log(operationMonkeys);
let neededValue = ["root", 0];
while (true) {
    neededValue = solveNeed(neededValue);
    console.log(neededValue);
    if (neededValue[0] === "humn") {
        console.log("you need to yell:", neededValue[1]);
        break;
    }
}
function solveNeed(needed) {
    const objective = needed[1];
    const monkey = operationMonkeys.get(needed[0]);
    let v1 = monkey.value1;
    let v2 = monkey.value2;
    let searchMonkeyName;
    let searchingValue;
    if (typeof v1 === "string" && typeof v2 === "number") { // we know the value of v2 and we search for the value of v1
        searchMonkeyName = v1;
        switch (monkey.operation) {
            case "+":
                searchingValue = objective - v2;
                break;
            case "-":
                searchingValue = objective + v2;
                break;
            case "*":
                searchingValue = objective / v2;
                break;
            case "/":
                searchingValue = objective * v2;
                break;
        }
    }
    else if (typeof v1 === "number" && typeof v2 === "string") {
        searchMonkeyName = v2;
        switch (monkey.operation) {
            case "+":
                searchingValue = objective - v1;
                break;
            case "-":
                searchingValue = v1 - objective;
                break;
            case "*":
                searchingValue = objective / v1;
                break;
            case "/":
                searchingValue = v1 / objective;
                break;
        }
    }
    else {
        throw "unsolvable values: " + v1 + " and " + v2;
    }
    return [searchMonkeyName, searchingValue];
}
// neededValues.set()
// console.log("root's number:", solvedMonkeys.get("root"));
