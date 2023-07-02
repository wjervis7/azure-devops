import { describe, it, expect } from "vitest";
import "../prototypes";

describe("String.prototype.formatUnicorn", () => {
    it("returns self when not passed args", () => {
        // arrange
        const val = "Test String";
        const expected = "Test String";

        // act
        const actual = val.formatUnicorn();

        // assert
        expect(actual).toBe(expected);
    });

    it("returns formatted string when using numbered args", () => {
        // arrange
        const val = "Hello {1}{0}";
        const expected = "Hello World!";

        // act
        const actual = val.formatUnicorn("!", "World");

        // assert
        expect(actual).toBe(expected);
    });

    it("returns formatted string when using named args", () => {
        // arrange
        const val = "Hello {object}{punc}";
        const expected = "Hello World!";

        // act
        const actual = val.formatUnicorn({ object: "World", punc: "!" });

        // assert
        expect(actual).toBe(expected);
    });
});

describe("Array.prototype.distinct", () => {
    it("returns unique items when not passed callback fn", () => {
        // arrange
        const val = [1, 2, 3, 2, 3, 4, 5];
        const expected = [1, 2, 3, 4, 5];

        // act
        const actual = val.distinct();

        // assert
        expect(actual).toEqual(expected);
    });

    it("returns unique items when passed callback fn", () => {
        // arrange
        const val = [
            {
                test: "a"
            },
            {
                test: "a"
            },
            {
                test: "b"
            }
        ];
        const expected = ["a", "b"];

        // act
        const actual = val.distinct(({ test }) => test);

        // assert
        expect(actual).toEqual(expected);
    });
});

describe("Array.prototype.intersect", () => {
    it("returns items from both arrays that equal each other", () => {
        // arrange
        const val = [1, 2, 3, 2, 3, 4, 5];
        const otherVal = [1, 3, 5];
        const expected = [1, 3, 5];

        // act
        const actual = val.intersect(otherVal);

        // assert
        expect(actual).toEqual(expected);
    });
});

describe("Number.isNumber", () => {
    it("returns true when passed a number", () => {
        // arrange
        const expected = true;
        const val = 1;

        // act
        const actual = Number.isNumber(val);

        // assert
        expect(actual).toBe(expected);
    });

    it("returns true when passed a number as a string", () => {
        // arrange
        const expected = true;
        const val = "1";

        // act
        const actual = Number.isNumber(val);

        // assert
        expect(actual).toBe(expected);
    });

    it("returns false when passed a string that is not a number", () => {
        // arrange
        const expected = false;
        const val = "not a number!";

        // act
        const actual = Number.isNumber(val);

        // assert
        expect(actual).toBe(expected);
    });

    it("returns false when passed a boolean", () => {
        // arrange
        const expected = false;
        const val = true;

        // act
        const actual = Number.isNumber(val);

        // assert
        expect(actual).toBe(expected);
    });
});
