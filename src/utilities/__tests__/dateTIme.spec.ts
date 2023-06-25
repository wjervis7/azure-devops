import { describe, it, expect } from "vitest";
import { Settings } from "luxon";
import { displayDate } from "../dateTime";

describe("displayDate", () => {
    it("parses and formats ISO dates correctly", () => {
        // arrange
                    Settings.defaultLocale = "en-us";
        const isoDate = "2016-05-25T09:24:15.123";;
        const expected = "5/25/2016, 9:24 AM";

        // act
        const actual = displayDate(isoDate);

        // assert
        expect(actual).toBe(expected);
    });
});
