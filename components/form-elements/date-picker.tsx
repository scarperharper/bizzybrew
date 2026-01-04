import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type DatePickerProps = {
  name?: string;
  label: string;
  className?: string;
  field?: FieldMetadata<any>;
};

export const DatePicker = ({ name, label, className, field }: DatePickerProps) => {
  const error = field?.errors?.[0];
  const inputName = field?.name || name;

  return (
    <div className="mb-5 w-full">
      <label
        htmlFor={inputName}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <input
        aria-label="Date"
        {...(field ? getInputProps(field, { type: 'date' }) : { name: inputName, id: inputName, type: 'date' })}
        className={cn(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          className
        )}
      />
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
    </div>
  );
};
