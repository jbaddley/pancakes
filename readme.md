# Pancake Flipper

### By Jason Baddley

## Instructions

1. At the root folder run `npm install` to get all dependencies
2. Next run `npm run build`
3. Next run `npm run start`
4. You should see the something like the following:

![Pancake console screenshot](/assets/pancake-screenshot.png)

## Changing the defaults

1. To see what options are available run `npm run start -- -h`
2. You can change any of the defaults by running: `npm run start -- [flags]`

## Options

### Stacks

- Description: Enter a stack of pancakes separated by commas or set to `random` to have the stacks generated
- Flag name: `-s` or `--stacks`
- Default: `-,-+,+-,+++,--+-`
- Example: `npm run start -- -s '--+-++-++,-+---+,+--+--+---+'` or `npm run start -- -s 'random'`

### Test Cases

- Description: When the `stacks` flag is set to `random`, `cases` will be used to generate that number of random pancake stacks.
- Flag name: `-c` or `--cases`
- Example: `npm run start -- -c 10`

### Max Stack Length

- Description: When the `stacks` flag is set to `random`, `max-length` will be used to generate random pancake stacks of no more this value.
- Flag name: `-ml` or `--max-length`
- Example: `npm run start -- -ml 25`
