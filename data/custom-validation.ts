import * as yup from "yup";

export const validAmount = yup
  .number()
  .test(
    "is-valid-number",
    "Please choose a valid amount",
    (value) => typeof value == "number" && value > 0
  )
  .required();

export const validSelection = yup
  .number()
  .test(
    "is-valid-number",
    "Please select an option",
    (value) => typeof value == "number" && value > 0
  )
  .required();

export const positiveOrZero = yup
  .number()
  .test(
    "is-valid-number",
    "Please choose a valid amount",
    (value) => typeof value == "number" && value >= 0
  )
  .required();
