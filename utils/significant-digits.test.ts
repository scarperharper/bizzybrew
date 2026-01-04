import { expect, test } from "vitest";
import { getSignificantDigitCount } from "./significant-digits";

test('tests some simple examples', () => {
    expect(
        getSignificantDigitCount(123)
    ).toStrictEqual(3);

    expect(
        getSignificantDigitCount(1234)
    ).toStrictEqual(4)
})
