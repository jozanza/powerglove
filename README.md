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

- [`pipe([Function...])`](#pipe)
- [`all([Function...])`](#all)

### pipe
- @param  `{[Function]} fns Array of functions to pipe value through`
- @return `Function -> Promise`

`pipe` accepts an array of functions. It returns a unary function that accepts any value. That value will be passed the first function in the array. Each successive function will pass its fulfilled value to the next once resolved.

**Example:**

```js
import { pipe } from 'powerglove'

void async () => {

  // weirdMath :: (Number -> Promise) -> Number
  const weirdMath = pipe([
    n => n / 1,
    n => n + 4,
    n => n * 7
  ])

  await weirdMath(2)
  // -> 42

}()
```

### all
- @param  `{[Function]} fns Array of functions to execute concurrently`
- @return `Function -> Promise`

`all` accepts an array of functions. It returns a unary function that accepts any value. That value will be passed to all functions in the array, which are then executed concurrently.

**Example:**

```js
import { all } from 'powerglove'

void async () => {

  // sayHi :: (String -> Promise) -> [String]
  const sayHi = all([
    x => `Hello, ${x}!`,
    x => `¡Hola, ${x}!`,
    x => `Bonjour, ${x}!`
  ])

  await sayHi('world')
  // -> [ 'Hello, world!', '¡Hola, world!', 'Bonjour, world!' ]

}()
```
