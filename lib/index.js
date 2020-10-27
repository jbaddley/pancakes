#!/usr/bin/env node
"use strict";
/*
  Author: Jason Baddley
  Email:  jasonbaddley@gmail.com
  Date:   10/27/2020
*/
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Though the ES6 import syntax is preferred, for some older
// modules built for node, the older commonjs
// syntax is just slightly easier to use
var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var program = require("commander");
var _ = require("lodash");
// Setup command line arguments
program
    .version("0.0.1")
    .description("An example CLI for flipping pancakes to their happy side (+)")
    .option("-s, --stacks <stacks>", 'Stacks of pancakes. If set to "random", will generate random stacks. Example: "-,-+,+-,+++,--+-"')
    .option("-c, --cases <cases>", 'Number of test cases to run if "--stacks" is set to "random"')
    .option("-ml, --max-length <length>", 'Max number of pancakes to add if "--stacks" is set to "random"');
/* Pancake Solver */
var PancakeFlipper = /** @class */ (function () {
    function PancakeFlipper(userInput) {
        var _this = this;
        this.stacksOfPancakes = [];
        this.generateStack = function (maxStackLength) {
            var length = Math.floor(Math.random() * (maxStackLength - 2)) + 2;
            return _.range(length).map(_this.randomSide).join("");
        };
        this.generateRandomStacks = function (tests, max) {
            return _.range(tests).map(function () { return _this.generateStack(max); });
        };
        // accept inputs from the user or use defaults to create the test cases (stacksOfPancakes)
        var _a = userInput.stacks, stacks = _a === void 0 ? "-,-+,+-,+++,--+-" : _a, _b = userInput.testCases, testCases = _b === void 0 ? 5 : _b, _c = userInput.maxStackLength, maxStackLength = _c === void 0 ? 10 : _c;
        if (stacks && stacks !== "random") {
            this.stacksOfPancakes = stacks.split(",");
        }
        else {
            this.stacksOfPancakes = this.generateRandomStacks(testCases, maxStackLength);
        }
    }
    PancakeFlipper.prototype.randomSide = function () {
        return Math.random() < 0.5 ? "+" : "-";
    };
    // recursively flip the pancakes until they are all + side up, keep track of times flipped, originalStack is there for
    // ease of printing later
    PancakeFlipper.prototype.flipAtIndex = function (caseNumber, stack, index, countSoFar, originalStack) {
        if (!stack.includes("-")) {
            return {
                caseNumber: caseNumber,
                flipped: stack,
                timesFlipped: countSoFar,
                original: originalStack,
            };
        }
        var nextArr = stack.split("").map(function (s, i) {
            if (i <= index) {
                return s === "+" ? "-" : "+";
            }
            return s;
        });
        var nextStack = nextArr.join("");
        countSoFar++;
        return this.flipAtIndex(caseNumber, nextStack, nextStack.lastIndexOf("-"), countSoFar, originalStack);
    };
    PancakeFlipper.prototype.printLine = function (_a, color) {
        var a = _a[0], b = _a[1], c = _a[2], d = _a[3], rest = _a.slice(4);
        // add padding to each column and pring out results
        a = color(String(a).padEnd(2, " "));
        b = color(String(b).padEnd(20, " "));
        c = color(String(c).padStart(3, " ").padEnd(20, " "));
        d = color(String(d).padEnd(25, " "));
        console.log.apply(console, __spreadArrays([a, b, c, d], rest));
    };
    PancakeFlipper.prototype.printResult = function (_a, caseNumber) {
        var original = _a.original, flipped = _a.flipped, timesFlipped = _a.timesFlipped;
        this.printLine([caseNumber || "", original, timesFlipped, flipped], chalk.green);
    };
    PancakeFlipper.prototype.run = function () {
        var _this = this;
        // add column headers
        this.printLine(["#", "Test Case", "Count", "Proof of Flipped"], chalk.cyan);
        // run the flipper on each case and collect the results
        var results = this.stacksOfPancakes.map(function (stack, i) { return _this.flipAtIndex(i + 1, stack, stack.lastIndexOf("-"), 0, stack); });
        // iterate through the results and print out to user
        results.forEach(function (result, i) { return _this.printResult(result, i + 1); });
    };
    return PancakeFlipper;
}());
function init() {
    // process the incoming args from the user
    // adding them to the `program` object for use later
    program.parse(process.argv);
    // clear the console to make room
    clear();
    // print out banner with padding
    console.log(chalk.red(figlet.textSync("Happy Pancakes", { horizontalLayout: "full" })));
    console.log();
    // create the user input and create a new PancakeFlipper instance
    var input = {
        stacks: program.stacks,
        maxStackLength: program.maxLength && +program.maxLength,
        testCases: program.cases && +program.cases,
    };
    var pancakeFlipper = new PancakeFlipper(input);
    // run the flipper and add padding to the output
    pancakeFlipper.run();
    console.log();
}
init();
