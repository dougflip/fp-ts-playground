import {
  option,
  map,
  getOrElse,
  fromNullable,
  fromPredicate,
  Option,
} from "fp-ts/lib/Option";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/pipeable";

const sequenceOption = sequenceT(option);
const fromFalsy: <T>(x: T) => Option<T> = fromPredicate((x) => !!x);

const result = pipe(
  sequenceOption(fromNullable("a"), fromNullable("b")),
  map(([x, y]) => `${x} and ${y}`),
  getOrElse(() => "default case")
);

console.log(result);

// example from Canopy

const meta = {
  application: "", // try `null` or `''` here instead
  appVersion: "2020",
};

const softwareDisplayValue = (metadata: typeof meta): string =>
  pipe(
    sequenceOption(
      fromFalsy(metadata.application),
      fromFalsy(metadata.appVersion)
    ),
    map(([app, version]) => `${app} ${version}`),
    getOrElse(() => "-")
  );

// Original from Canopy
// const softwareDisplayValue = metadata => {
//     const application = get(metadata, 'application', undefined);
//     const version = get(metadata, 'appVersion', undefined);
//     return application && version ? `${application} ${version}` : '—';
// };

console.log("Software: ", softwareDisplayValue(meta));

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

// example to deal with empty strings
const submissionDateDisplayValue = (rawStringDate: string): string =>
  pipe(
    fromFalsy(rawStringDate),
    map((x) => new Date(x)),
    map(formatDate),
    getOrElse(() => "-")
  );

// original from Canopy
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

console.log("Date: ", submissionDateDisplayValue("2020-01-01"));
