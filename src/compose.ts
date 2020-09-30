type Func<T extends any[], R> = (...a: T) => R

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export default function compose(): <R>(a: R) => R

export default function compose<F extends Function>(f: F): F

/* two functions */
export default function compose<A, T extends any[], R>(
  f1: (a: A) => R,
  f2: Func<T, A>
): Func<T, R>

/* three functions */
export default function compose<A, B, T extends any[], R>(
  f1: (b: B) => R,
  f2: (a: A) => B,
  f3: Func<T, A>
): Func<T, R>

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
  f1: (c: C) => R,
  f2: (b: B) => C,
  f3: (a: A) => B,
  f4: Func<T, A>
): Func<T, R>

/* rest */
export default function compose<R>(
  f1: (a: any) => R,
  ...funcs: Function[]
): (...args: any[]) => R

export default function compose<R>(...funcs: Function[]): (...args: any[]) => R
// 把多个函数组合为一个函数调用
export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
}


// function compose(...funcs) {
//   if (funcs.length === 0) {
//     // infer the argument type so it is usable in inference down the line
//     return;
//   }

//   if (funcs.length === 1) {
//     return funcs[0];
//   }

//   return funcs.reduce((a, b) => (...args) => a(b(...args)));
// }

// const f1 = (a) => {
//   console.log("f1" + a);
//   return "f1" + a;
// };
// const f2 = (a) => {
//   console.log("f2" + a);
//   return "f2" + a;
// };
// const f3 = (a) => {
//   console.log("f3" + a);
//   return "f3" + a;
// };

// var a = compose(f1, f2, f3)("xyz");
// console.log("a answer is: ", a);
/**
 *
  f3xyz
  f2f3xyz
  f1f2f3xyz
  a answer is:  f1f2f3xyz
 */
