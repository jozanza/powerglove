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
- [`when`](#whenfunctionfunctionfunction---promise---)
- ...more docs coming soon!

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

  const addOneHundredThousand = tail(100000)(x => x + 1)

  await addOneHundredThousand(0)
  // -> 100000

}()
```

<hr />

##### `when(Function)(Function)(Function) -> Promise -> *`

`when` accepts a function or async function that returns `true` or `false`.
It curries two successive functions; The first accepts a callback that gets called when the initial function returns `true`. The second accepts a callback that gets called when the initial function returns `false`.

**Example:**

```js
import { when } from 'powerglove'

void async () => {

  const over9000 = when(lvl => lvl > 9000)
    (lvl => `Holy crap! ${lvl}?! THAT'S OVER 9000!`) // true
    (lvl => `Pffft. ${lvl}? Is that all you got???`) // false

  await over9000(9001)
  // -> `Holy crap! 9001?! THAT'S OVER 9000!`

}()
```
