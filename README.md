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

##### `pipe([Function f, ...]) -> Function(*) -> Promise -> *`

Accepts an array of functions or async functions and returns a unary function
that accepts any value. That value will be passed to the first function in the
array. Subsquent functions receive the return value of the previous function.

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

### all

##### `all([Function f, ...]) -> Function(*) -> Promise -> [*]`

Accepts an array of functions or async functions and returns a unary function
that accepts any value. That value will be passed to all functions in the array,
which are then executed concurrently. Returns an array of values returned from
each function in the array

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

### race

##### `race([Function f, ...]) -> Function(*) -> Promise -> *`

Accepts an array of functions or async functions and returns a unary function
that accepts any value. That value will be passed to all functions in the array,
which are then executed concurrently. Returns the value of the first function to resolve.

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

### until

##### `until(Function test)(Function cb) -> Function(*) -> Promise -> *`

Executes `cb` until `test` returns `true`. The return value of
the previous `cb` is passed into the next on each iteration.

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

### when

##### `when(Function test)(Function pass)(Function fail) -> Function(*) -> Promise -> *`

Executes `pass` if `test` returns `true`, otherwise it calls `fail`.

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

### delay

##### `delay(Number ms)(Function cb) -> Function(*) -> Promise -> *`

Accepts `ms`, number of milliseconds to wait, before executing `cb`.

**Example:**

```js
import { delay } from 'powerglove'

void async () => {

  const timeSince = delay(300)(ms => Date.now() - ms)

  await timeSince(Date.now())
  // -> ~300ms

}()
```
