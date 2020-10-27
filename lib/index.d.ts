#!/usr/bin/env node
declare const chalk: any;
declare const clear: any;
declare const figlet: any;
declare const program: any;
declare const _: any;
interface UserInput {
    stacks?: string;
    testCases?: number;
    maxStackLength?: number;
}
interface Result {
    caseNumber: number;
    original?: string;
    flipped: string;
    timesFlipped: number;
}
declare class PancakeFlipper {
    stacksOfPancakes: string[];
    private randomSide;
    private generateStack;
    private generateRandomStacks;
    private flipAtIndex;
    private printLine;
    private printResult;
    constructor(userInput: UserInput);
    run(): void;
}
declare function init(): void;
