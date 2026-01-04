import { test, expect } from "vitest";
import { parseSelection } from './parse-selection';

test('creates extracts an ID from a selection', () => {
  const selection = {
    "1": true,
    "2": true
  }

  const id = parseSelection(selection);
  expect(id).toEqual(1)
})