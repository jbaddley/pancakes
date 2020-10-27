#!/usr/bin/env node
/*
  Author: Jason Baddley
  Email:  jasonbaddley@gmail.com
  Date:   10/27/2020
*/

// Though the ES6 import syntax is preferred, for some older
// modules built for node, the older commonjs
// syntax is just slightly easier to use
const chalk = require("chalk")
const clear = require("clear")
const figlet = require("figlet")
const program = require("commander")
const _ = require("lodash")

// Setup command line arguments
program
  .version("0.0.1")
  .description("An example CLI for flipping pancakes to their happy side (+)")
  .option("-s, --stacks <stacks>", 'Stacks of pancakes. Example: "-,-+,+-,+++,--+-". If set to "random", will generate random stacks.')
  .option("-c, --cases <cases>", 'Number of test cases to run if "--stacks" is set to "random". Must be between 1 and 100 inclusive.')
  .option("-ml, --max-length <length>", 'Max number of pancakes to add if "--stacks" is set to "random". Must be between 1 and 50 inclusive.')

/*
  Interfaces
*/
interface UserInput {
  stacks?: string
  testCases?: number
  maxStackLength?: number
}

interface Result {
  caseNumber: number
  original?: string
  flipped: string
  timesFlipped: number
}

/* Pancake Solver */
class PancakeFlipper {
  stacksOfPancakes: string[] = []

  private randomSide() {
    return Math.random() < 0.5 ? "+" : "-"
  }

  private generateStack = (maxStackLength: number) => {
    const length = Math.floor(Math.random() * (maxStackLength - 1)) + 1
    return _.range(length).map(this.randomSide).join("")
  }

  private generateRandomStacks = (tests: number, max: number): string[] => {
    return _.range(tests).map(() => this.generateStack(max))
  }

  // recursively flip the pancakes until they are all + side up, keep track of times flipped, originalStack is there for
  // ease of printing later
  private flipAtIndex(caseNumber: number, stack: string, index: number, countSoFar: number, originalStack: string): Result {
    if (!stack.includes("-")) {
      return {
        caseNumber,
        flipped: stack,
        timesFlipped: countSoFar,
        original: originalStack,
      } as Result
    }

    const nextArr = stack.split("").map((s: string, i: number) => {
      if (i <= index) {
        return s === "+" ? "-" : "+"
      }
      return s
    })

    const nextStack = nextArr.join("")
    countSoFar++
    return this.flipAtIndex(caseNumber, nextStack, nextStack.lastIndexOf("-"), countSoFar, originalStack)
  }

  private printLine([a, b, c, d, ...rest]: any[], color: any) {
    // add padding to each column and pring out results
    a = color(String(a).padEnd(3, " "))
    b = color(String(b).padEnd(20, " "))
    c = color(String(c).padStart(3, " ").padEnd(20, " "))
    d = color(String(d).padEnd(25, " "))
    console.log(a, b, c, d, ...rest)
  }

  private printResult({ original, flipped, timesFlipped }: Result, caseNumber?: number) {
    this.printLine([caseNumber || "", original, timesFlipped, flipped], chalk.green)
  }

  constructor(userInput: UserInput) {
    // accept inputs from the user or use defaults to create the test cases (stacksOfPancakes)
    const { stacks = "-,-+,+-,+++,--+-", testCases = 5, maxStackLength = 10 } = userInput
    if (stacks && stacks !== "random") {
      this.stacksOfPancakes = stacks.split(",")
    } else {
      this.stacksOfPancakes = this.generateRandomStacks(testCases, maxStackLength)
    }
  }

  run() {
    // add column headers
    this.printLine(["#", "Test Case", "Count", "Proof of Flipped"], chalk.cyan)

    // run the flipper on each case and collect the results
    const results: Result[] = this.stacksOfPancakes.map((stack: string, i: number) => this.flipAtIndex(i + 1, stack, stack.lastIndexOf("-"), 0, stack))

    // iterate through the results and print out to user
    results.forEach((result: Result, i: number) => this.printResult(result, i + 1))
  }
}

function init() {
  // process the incoming args from the user
  // adding them to the `program` object for use later
  program.parse(process.argv)

  // clear the console to make room
  clear()

  // create the user input and create a new PancakeFlipper instance
  const input = {
    stacks: program.stacks,
    maxStackLength: program.maxLength && +program.maxLength,
    testCases: program.cases && +program.cases,
  } as UserInput

  if (input.testCases) {
    if (input.testCases > 100) {
      console.error("Please enter a number of test cases of no more than 100")
      process.exit(0)
    }
    if (input.testCases < 1) {
      console.error("Please enter a number of test cases of more than 0")
      process.exit(0)
    }
  }

  if (input.maxStackLength) {
    if (input.maxStackLength > 50) {
      console.error("Please enter a max stack length of no more than 100")
      process.exit(0)
    }
    if (input.maxStackLength < 1) {
      console.error("Please enter a max stack length of more than 0")
      process.exit(0)
    }
  }

  // print out banner with padding
  console.log(chalk.red(figlet.textSync("Happy Pancakes", { horizontalLayout: "full" })))
  console.log()

  const pancakeFlipper = new PancakeFlipper(input)

  // run the flipper and add padding to the output
  pancakeFlipper.run()
  console.log()
  process.exit(0)
}

init()
