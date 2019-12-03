import { Either, right, left, map, chain, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import fmap from "lodash/fp/map";

interface Failure {
  message: string;
}

/**
 * Very simple function to illustrate `map`ing.
 */
const double = (x: number): number => x * 2;

// ============================================================================
// pipe
// ============================================================================
/**
 * The `pipe` function is pretty basic.
 * It takes a value and "pipes" it through functions.
 */
const simpleDouble = pipe(
  2, // the starting value...
  double, // ...and a series of functions...
  x => `Your doubled result is ${x}` // ...to pipeline
);

console.log(simpleDouble); // Your doubled result is 4
console.log("--------------------------------------------------");

// ============================================================================
// map
// ============================================================================
/**
 * First, lets look at map with Array because it is already familiar to us.
 * We can think of an array as a "wrapper" that models 0 or more items.
 * We can't "double" our array directly, we need to use `map`.
 * Consider that we can use the same pipeline with `[]` as with `[2]`.
 */
const arrayDouble = pipe(
  [2],
  // xs => xs.map(double),
  fmap(double),
  xs => `Your doubled array is ${JSON.stringify(xs)}`
);

console.log(arrayDouble); // Your doubled array is [4]
console.log("--------------------------------------------------");

/**
 * Think of Either in much the same way as Array.
 * Instead of being a wrapper for 0 or more it is a wrapper for success and failure.
 * When you want to indicate "success" wrap it in `right`.
 * When you want to indicate "failure" wrap it in `left`.
 * Both `right` and `left` are of type `Either<E,A>` - in our case `Either<Failure, string>` -
 * just like `[]` and `[1,2,3]` are all of type `number[]`.
 */
const myLeft: Either<Failure, string> = left({ message: "Whoops!" });
const myRight: Either<Failure, string> = right("Success!");

/**
 * Just like an array, we can't "double" an `Either` directly.
 * We need to use `map` to access the underlying value.
 * Notice how close this is to the first example just wrapped in another layer.
 * What's neat is that `left`s never invoke the mapping function.
 * This is really similar to how `[]` doesn't invoke a mapping function.
 */
const eitherDouble: Either<Failure, string> = pipe(
  right(2),
  // left({ message: "Whoops, we never reveived a number!" }),
  map(double),
  map(x => `Your doubled result is ${x}`)
);

console.log(eitherDouble); // { _tag: 'Right', right: 'Your doubled result is 4' }
console.log("--------------------------------------------------");

/**
 * Let's see a slightly more meaningful example.
 * This function tries to parse a string to an integer.
 * Instead of returning `NaN` back to our callers, we'll encode the chance of failure in the types.
 * Now, everyone (including the compiler) knows that there is a chance this will fail.
 * We'll force callers to deal with it.
 */
function parseIntSafe(val: string): Either<Failure, number> {
  const result = parseInt(val, 10);
  return isNaN(result)
    ? left({ message: `Could not parse "${val}" to an integer` })
    : right(result);
}

const doubleParsedInt: Either<Failure, string> = pipe(
  parseIntSafe("2"),
  // parseIntSafe("asdf"),
  map(double),
  map(x => `Your doubled int from a string is ${x}`)
);

console.log(doubleParsedInt); // { _tag: 'Right', right: 'Your doubled int from a string is 4' }
console.log("--------------------------------------------------");

// ============================================================================
// chain
// ============================================================================
/**
 * What happens if we have multiple actions that can fail?
 * What if a function we want to `map` returns an Either itself?
 * So far, we've only returned primitive/non wrapped values from our mapping functions.
 * Let's say we want to take in a string of a user ID and then
 * use that to lookup the user.
 */
interface User {
  id: number;
}
const users: User[] = [{ id: 1 }, { id: 2 }];

function findUser(id: number): Either<Failure, User> {
  const user = users.find(x => x.id === id);
  return user ? right(user) : left({ message: `No user with id: ${id}` });
}

/**
 * The `findUser` portion of our pipeline itself returns an Either.
 * Since we don't want to "nest" an Either within an Either we can use `chain`.
 * This works very similar to `flatMap` on an array.
 */
const lookupUser: Either<Failure, string> = pipe(
  "1",
  // "asdf",
  // "123",
  parseIntSafe,
  // Use chain to "flatten" the nested Either...
  chain(findUser),
  map(x => `Found user ${x.id} in our list!`)
);

console.log(lookupUser); // { _tag: 'Right', right: 'Found user 1 in our list!' }
console.log("--------------------------------------------------");

// ============================================================================
// fold
// ============================================================================
/**
 * Finally, we can `fold` our Either into a single value.
 * We provide a function for the failure side
 * and a function for the success side.
 * These both return the same type and get us to a value of that type.
 */
const user: string = pipe(
  "2",
  //   "asdf",
  //   "123",
  parseIntSafe,
  chain(findUser),
  fold(
    err => err.message,
    user => `Found user ${user.id} in our list!`
  )
);

console.log(user); // Found user 2 in our list!
