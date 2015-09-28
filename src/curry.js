/**
 * Curries function based on f.length or specified arity
 * @param  {Function} f              A function
 * @param  {Number}   arity=f.length Number of arguments to curry
 * @return {Function}                Partially applied function
 */
export default function curry(f, arity=f.length) {
  return function g(...args) {
    return args.length >= arity
      ? f(...args.slice(0, arity))
      : (..._args) => g(...args.concat(_args.length ? _args : [undefined]));
  };
}
