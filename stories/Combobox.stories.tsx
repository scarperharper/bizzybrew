import { Combobox, ComboboxProps } from "@/components/local/combobox";
import React from "react";
import "../app/globals.css";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { ValidatedForm } from "remix-validated-form";
import { createRoutesStub } from "react-router";

const meta = {
  title: "Components/Combobox",
  component: Combobox,
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
    language: yup.number(),
  })
);

export function Default(args: React.JSX.IntrinsicAttributes & ComboboxProps) {
  return (
    <ValidatedForm
      method="post"
      validator={validator}
      className="flex flex-col flex-1"
    >
      <Combobox {...args} />
    </ValidatedForm>
  );
}

Default.args = {
  name: "language",
  label: "Language",
  guidance: "Please choose the language",
  options: [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" },
  ],
};

export default meta;
