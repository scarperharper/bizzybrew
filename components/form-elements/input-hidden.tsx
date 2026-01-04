import { getInputProps, type FieldMetadata } from "@conform-to/react";

type InputHiddenProps = {
  name: string;
  value?: string | number | readonly string[] | undefined;
  field?: FieldMetadata<any>;
};

export const InputHidden = ({ name, value, field }: InputHiddenProps) => {
  // If field is provided, use conform's getInputProps, otherwise just render a plain hidden input
  if (field) {
    return (
      <div>
        <input type="hidden" {...getInputProps(field, { type: 'hidden' })} />
      </div>
    );
  }

  return (
    <div>
      <input type="hidden" name={name} value={value} id={name} />
    </div>
  );
};
