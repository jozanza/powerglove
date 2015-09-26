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

##### `npm install powerglove`

API
---

- [`pipe`](#pipefunction---promise---)
- [`all`](#allfunction---promise---)
- [`tail`](#tailnumberfunction---promise---)

<hr />

##### `pipe([Function]) -> Promise -> *`

`pipe` accepts an array of functions or async functions. It returns a unary function that accepts any value. That value will be passed the first function in the array. Each successive function will pass its fulfilled value to the next once resolved.

**Example:**

```js
import { pipe } from 'powerglove'

void async () => {

  const weirdMath = pipe([
    n => n / 1,
    n => n + 4,
    n => n * 7
  ])

  await weirdMath(2)
  // -> 42

}()
```

<hr />

##### `all([Function]) -> Promise -> [*]`

`all` accepts an array of functions or async functions. It returns a unary function that accepts any value. That value will be passed to all functions in the array, which are then executed concurrently.

**Example:**

```js
import { all } from 'powerglove'

void async () => {

  const sayHi = all([
    x => `Hello, ${x}!`,
    x => `¡Hola, ${x}!`,
    x => `Bonjour, ${x}!`
  ])

  await sayHi('world')
  // -> [ 'Hello, world!', '¡Hola, world!', 'Bonjour, world!' ]

}()
```

<hr />

##### `tail(Number)(Function) -> Promise -> *`

`tail` accepts a number of times to recursively call a function or async function.
It implements trampoline, so you can call a function a very large number of times
without causing a stack overflow.

**Example:**

```js
import { tail } from 'powerglove'

void async () => {

  let addOneHundredThousand = tail(100000)(x => x + 1)

  await addOneHundredThousand(0)
  // -> 100000

}()
```
