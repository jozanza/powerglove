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
- [API](#api)

Installation
------------

###### `npm install powerglove`

API
---

#### pipe

```js
// pipe :: [(a -> b)] -> (c -> Promise) -> d
import { pipe } from 'powerglove'
```

`pipe` accepts an array of functions. It returns a unary function that accepts any value. That value will be passed through the array of functions in succession.

```js
void async () => {

  // weirdMath :: (Number a -> Promise) -> Number b
  const weirdMath = pipe([
    n => n / 1,
    n => n + 4,
    n => n * 7
  ])

  const result = await weirdMath(2)

  console.log(result)
  // -> 42

}()
```

<hr />

#### all

```js
// all :: [(a -> b)] -> (c -> Promise) -> [d]
import { all } from 'powerglove'
```

`all` accepts an array of functions. It returns a unary function that accepts any value. That value will be passed to all functions in the array and executes them concurrently.

```js
void async () => {

  const sayHi = all([
    x => `Hello, ${x}!`,
    x => `¡Hola, ${x}!`,
    x => `Bonjour, ${x}!`
  ])

  const result = await sayHi('world')

  console.log(result)
  // -> [ 'Hello, world!', '¡Hola, world!', 'Bonjour, world!' ]

}()
```
