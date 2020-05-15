import { map, getOrElse } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { sequenceOption, fromFalsy } from "./utils";

// example from Canopy
interface FileMetadata {
  application?: string;
  appVersion?: string;
}

const softwareDisplayValue = (metadata: FileMetadata): string =>
  pipe(
    sequenceOption(
      fromFalsy(metadata.application),
      fromFalsy(metadata.appVersion)
    ),
    map(([app, version]) => `${app} ${version}`),
    getOrElse(() => "-")
  );

describe("combining two potentially null/falsy values", () => {
  it("returns the default when both values are missing", () => {
    expect(softwareDisplayValue({})).toBe("-");
  });

  it("returns the default when application is missing", () => {
    expect(softwareDisplayValue({ appVersion: "3.0.0" })).toBe("-");
  });

  it("returns the default when appVersion is missing", () => {
    expect(softwareDisplayValue({ application: "MS Word" })).toBe("-");
  });

  it("returns the default when appVersion is falsy", () => {
    expect(
      softwareDisplayValue({ application: "MS Word", appVersion: "" })
    ).toBe("-");
  });

  it("returns the formatted string when both are populated", () => {
    expect(
      softwareDisplayValue({ application: "MS Word", appVersion: "3.0.0" })
    ).toBe("MS Word 3.0.0");
  });
});

// Original from Canopy
// const softwareDisplayValue = metadata => {
//     const application = get(metadata, 'application', undefined);
//     const version = get(metadata, 'appVersion', undefined);
//     return application && version ? `${application} ${version}` : '—';
// };
