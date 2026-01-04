import React from "react";
import "../app/globals.css";
import { createRoutesStub } from "react-router";
import {
  CurrencyInput,
  CurrencyInputProps,
} from "@/components/form-elements/currency-input";
import * as yup from "yup";
import { ValidatedForm } from "remix-validated-form";
import { withYup } from "@remix-validated-form/with-yup";

const meta = {
  title: "Components/CurrencyInput",
  component: CurrencyInput,
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (story: any) => {
      const remixStub = createRoutesStub([
        {
          path: "/*",
          action: () => ({ redirect: "/" }),
          loader: () => ({ redirect: "/" }),
          Component: () => story(),
        },
      ]);

      return remixStub({ initialEntries: ["/"] });
    },
  ],
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  tags: ["autodocs"],
};

const validator = withYup(
  yup.object({
    amount: yup.number(),
  })
);

export function Default(
  args: React.JSX.IntrinsicAttributes & CurrencyInputProps
) {
  return (
    <ValidatedForm
      method="post"
      validator={validator}
      defaultValues={{ amount: 0 }}
    >
      <CurrencyInput {...args} />
    </ValidatedForm>
  );
}

Default.args = {
  name: "amount",
  label: "Amount",
};

export default meta;
