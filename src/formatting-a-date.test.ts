import { map, getOrElse } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { fromFalsy, formatDate } from "./utils";

// need to parse a date and format it
const submissionDateDisplayValue = (rawStringDate: string): string =>
  pipe(
    fromFalsy(rawStringDate),
    map((x) => new Date(x)),
    map(formatDate),
    getOrElse(() => "-")
  );

describe("formatting a date", () => {
  it("returns the default when the string is empty", () => {
    expect(submissionDateDisplayValue("")).toBe("-");
  });

  it("returns the formatted string for a proper date", () => {
    expect(submissionDateDisplayValue("2020-01-01")).toMatchInlineSnapshot(
      `"December 31, 2019, 07:00 PM EST"`
    );
  });
});

/**
 * Original function from Canopy that I wanted to change.
 * I was interested in it mostly because it had multiple checks.
 */
// const submissionDateDisplayValue = rawStringDate => {
//     const rawDate = rawStringDate ? new Date(rawStringDate) : undefined;
//     if (rawDate) {
//         const options = {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             timeZoneName: 'short',
//         };
//         // using `undefined` varies according to default locale
//         return rawDate.toLocaleDateString(undefined, options);
//     }
//     return '—';
// };
