<p align="center">
  <a href="http://badge.fury.io/js/powerglove">
    <img alt="npm version" src="https://badge.fury.io/js/powerglove.svg" />
  </a>
  <a href="https://travis-ci.org/jozanza/powerglove">
    <img alt="build status" src="https://travis-ci.org/jozanza/powerglove.svg" />
  </a>
  <a href="https://david-dm.org/jozanza/powerglove">
    <img alt="dependency status" src="https://david-dm.org/jozanza/powerglove.svg" />
  </a>
  <a href="https://david-dm.org/jozanza/powerglove#info=devDependencies">
    <img alt="devdependency status" src="https://david-dm.org/jozanza/powerglove/dev-status.svg" />
  </a>
  <a href='https://coveralls.io/github/jozanza/powerglove?branch=master'>
    <img src='https://coveralls.io/repos/jozanza/powerglove/badge.svg?branch=master&service=github' alt='Coverage Status' />
  </a>
</p>

# Powerglove

### Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Utils](#API)

Installation
------------

###### `npm install powerglove`

Getting Started
---------------

Start by importing the module:

```js
import * as powerglove from 'powerglove'
```

Let's try piping a value through a series of functions.

```js
void async () => {
  const result = await powerglove.pipe(
    n => 2,
    n => n + 4,
    n => n * 7
  )
  console.log(result)
  // -> 42
}();
```

Okay, nothing special. But we have complete interop between async and async functions. Check it out:

```js
void async () => {
  const result = await hello('world')
  console.log(result)
  // -> 'HELLO, WORLD!'
}()

async function hello(name) {
  return await powerglove.pipe(
    name,
    greet,
    uppercase,
    exclaim
  );
}

function greet(x) {
  return `Hello, ${x}`
}

async function uppercase(x) {
  await sleep(100)
  return x.toUpperCase()
}

async function exclaim(x) {
  await sleep(100)
  return `${x}!`
}

async function sleep(ms=0) {
  return new Promise(fulfill => {
    setTimeout(fulfill, ms)
  })
}

```



Utils
-----

### pipe(value[, ...tasks])
```js
/**
 *
 * Pipes a value through a collection of a/sync functions
 *
 * @param  {*}          value The seed value for the pipe
 *                            immediately invoked if instance of Function
 * @param  {[Function]} tasks An array of functions to pipe `value` through
 * @return {Promise}          Final result of pipe
 */
```
