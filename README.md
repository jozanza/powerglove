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
- [API](#API)

Installation
------------

###### `npm install powerglove`

Getting Started
---------------

...description

```js
import * as powerglove 'powerglove';

// Pipe a value through a series of functions
void async () => {
  const result = await powerglove.pipe(
    n => 2,
    n => n + 4,
    n => n * 7
  );
  console.log(result);
  // -> 42
}();

// Pipe a value through an series of async functions
void async () => {
  const result = await powerglove.pipe(
    async (n) => {
      await sleep(100)
      return 2
    },
    async (n) => {
      await sleep(100)
      return n + 4
    },
    async (n) => {
      await sleep(100)
      return n * 7
    },
  );
  // ...and after ~300ms,
  console.log(result);
  // -> 42
}();
```

API
---

## Utils

### pipe(...tasks)
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
