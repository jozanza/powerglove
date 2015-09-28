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

- [`pipe`](#pipe)
- [`all`](#all)
- [`race`](#race)
- [`until`](#until)
- [`when`](#when)
- [`delay`](#delay)
- ...more docs coming soon!

<hr />

### pipe

##### `[(a -> *)] -> a -> Promise -> *`

Passes a value through an array of functions sequentially; Returns value fulfilled
from final function in the array.

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
**Params:**

|        | Type         | Name  | Description |
|--------|--------------|-------|-------------|
|@param  | `[Function]` | funcs | Array of functions
|@param  | `*`          | x     | Any value
|@return | `Promise`    |       | Fulfills with value returned by final function in the array

<hr />

### all

##### `[(a -> *)] -> a -> Promise -> [*]`

Executes an array of functions concurrently; returns an array of fulfilled values.

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
**Params:**

|        | Type         | Name  | Description |
|--------|--------------|-------|-------------|
|@param  | `[Function]` | funcs | Array of functions
|@param  | `*`          | x     | Any value
|@return | `Promise`    |       | Fulfills with an array of values returned from each function in `funcs`

<hr />

### race

##### `[(a -> *)] -> a -> Promise -> *`

Executes an array of functions concurrently; Returns value of first function to resolve.

**Example:**

```js
import { race, delay } from 'powerglove'

void async () => {

  const fast = delay(200)(x => `${x} Speed Racer`)

  const faster = delay(100)(x => `${x} Racer X`)

  const fastest = delay(0)(x => `${x} Chim Chim`)

  const announceWinner = race([
    fast,
    faster,
    fastest
  ])

  await announceWinner('And the winner is...')
  // -> `And the winner is... Chim Chim!`

}()
```

**Params:**

|        | Type         | Name  | Description |
|--------|--------------|-------|-------------|
|@param  | `[Function]` | funcs | Array of functions
|@param  | `*`          | x     | Any value
|@return | `Promise`    |       | Fulfills with value of first function in `funcs` to resolve

<hr />

### until

##### `(a -> Bool) -> (a -> *) -> a -> Promise -> *`

Executes function until `done` returns `true`. The return value of
the repeating function is passed into itself on each successive iteration.

**Example:**

```js
import { until } from 'powerglove'

void async () => {

  const minusminus = x => x - 1

  const smallEnough = x => x <= 0

  const subtractAll = until(smallEnough)(minusminus)

  await subtractAll(100000)
  // -> 0

  const plusplus = x => x + 1

  const largeEnough = x => x >= 100000

  const addALot = until(largeEnough)(plusplus)

  await addALot(0)
  // -> 100000

}()
```

**Params:**

|        | Type       | Name  | Description |
|--------|------------|-------|-------------|
|@param  | `Function` | done  | Accepts value returned by `f`. `f` is called repeatedly until this function returns `true`
|@param  | `Function` | f     | Function to be called repeatedly. Passes its own return value into itself on each iteration
|@param  | `*`        | x     | Any value
|@return | `Promise`  |       | Fulfills result of `f` after n recursive calls

<hr />

### when

##### `(a -> Bool) -> (a -> *) -> (a -> *) -> a -> Promise -> *`

Tests a value and passes value to either the `pass` function or the `fail` function

**Example:**

```js
import { when } from 'powerglove'

void async () => {

  const over9000 = lvl => lvl > 9000

  const praise = lvl => `Holy crap! ${lvl}?! THAT'S OVER 9000!`

  const insult = lvl => `Pffft. ${lvl}? Is that all you got???`

  const analyzePowerLevel = when(over9000)(praise)(insult)

  await analyzePowerLevel(9001)
  // -> `Holy crap! 9001?! THAT'S OVER 9000!`

  await analyzePowerLevel(1)
  // -> `Pffft. 1? Is that all you got???`

}()
```

**Params:**

|        | Type       | Name  | Default  | Description |
|--------|------------|-------|----------|-------------|
|@param  | `Function` | test  |          | Accepts `x`; returns `true` or `false`
|@param  | `Function` | pass  |          | Called with `x` if `test` returns `true`
|@param  | `Function` | fail  | `a => a` | Called with `x` if `test` returns `false`
|@param  | `*`        | x     |          | Any value
|@return | `Promise`  |       |          | Fulfills with value returned by `pass` or `fail`


<hr />

### delay

##### `Number -> (a -> *) -> a -> Promise -> *`

Accepts `ms`, number of milliseconds to wait, before executing function `f`.

**Example:**

```js
import { delay } from 'powerglove'

void async () => {

  const timeSince = delay(300)(ms => Date.now() - ms)

  await timeSince(Date.now())
  // -> ~300ms

}()
```

**Params:**

|        | Type       | Name  | Description |
|--------|------------|-------|-------------|
|@param  | `Number`   | funcs | Array of functions
|@param  | `Function` | f     | Function to be called after timeout
|@param  | `*`        | x     | Any value
|@return | `Promise`  |       | Fulfills with value returned by `f(x)`
