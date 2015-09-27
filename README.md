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
- [`race`](#racefunction---promise---)
- [`until`](#untilfunctionfunction---promise---)
- [`when`](#whenfunctionfunctionfunction---promise---)
- [`delay`](#delaynumberfunction---promise---)
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

##### `race([Function]) -> Promise -> *`

`race` accepts an array of functions or async functions. It returns a unary function that accepts any value. That value will be passed to all functions in the array, which are then executed concurrently. The return value of first function to complete
will be returned.

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

<hr />

##### `until(Function)(Function) -> Promise -> *`

`tail` accepts a function or async function that returns true or false. Recursive function calls will continue until it returns true;
It implements trampoline, so you can call a function a very large number of times
without causing a stack overflow.

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

<hr />

##### `when(Function)(Function)(Function) -> Promise -> *`

`when` accepts a function or async function that returns `true` or `false`.
It curries two successive functions; The first accepts a callback that gets called when the initial function returns `true`. The second accepts a callback that gets called when the initial function returns `false`.

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

<hr />

##### `delay(Number)(Function) -> Promise -> *`

`delay` accepts a number of ms to wait before calling a function or async function.

**Example:**

```js
import { delay } from 'powerglove'

void async () => {

  const timeSince = delay(300)(ms => Date.now() - ms)

  await timeSince(Date.now())
  // -> ~300ms

}()
```
