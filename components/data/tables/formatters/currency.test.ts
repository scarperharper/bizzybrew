import { test, expect } from "vitest";
import { currency } from "./currency";

test("correctly formats a currency", () => {
  const amount = 212;
  const formatted = currency(amount);
  expect(formatted).toEqual("£2.12");
});
