import { option, fromPredicate, Option } from "fp-ts/lib/Option";
import { sequenceT } from "fp-ts/lib/Apply";

/**
 * Allows you to sequence a variable number of Option instances.
 * You can roughly think of this as `Promise.all`.
 * When you map over the result you'll get an array of values.
 */
export const sequenceOption = sequenceT(option);

/**
 * Returns `none` for any JS falsy value
 * and returns `some(x)` for any JS truthy value.
 */
export const fromFalsy: <T>(x: T) => Option<T> = fromPredicate((x) => !!x);

/**
 * Helper to format a date - just keeping noise out of the other files.
 */
export const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
