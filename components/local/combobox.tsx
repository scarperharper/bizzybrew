import { CaretSortIcon, CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { type FieldMetadata } from "@conform-to/react";
import { Entity } from "@/data/models/Entity";

export type ComboboxOption = {
  value: string;
  label: string;
  group?: string;
  entity?: Entity;
};

export interface ComboboxProps {
  /**
   * An array of available options
   */
  options: ComboboxOption[];
  /**
   *
   * Field name
   */
  name?: string;
  /**
   * User-facing label
   */
  label: string;
  /**
   * Initial value
   */
  value?: string;
  /**
   * A message to show with the control
   */
  guidance: string;
  /**
   * Class name
   */
  className?: string;
  /**
   * Callback when item is selected
   */
  onSelectOption?: (option: ComboboxOption) => void;
  /**
   * Callback when item is created
   */
  onCreateOption?: (selected: string) => void;
  /**
   * Field metadata from conform
   */
  field?: FieldMetadata<any>;
}

export function Combobox({
  options,
  name,
  label,
  value,
  guidance,
  className,
  onSelectOption,
  onCreateOption,
  field,
}: ComboboxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [_options, setOptions] = useState(options);
  const [_generatedOption, setGeneratedOption] = useState(
    {} as ComboboxProps["options"][0]
  );
  const [open, setOpen] = useState(false);
  const [_value, setValue] = useState(value);
  const error = field?.errors?.[0];
  const inputName = field?.name || name;

  useEffect(() => {
    const allOptions = [...options, _generatedOption].filter(
      (option) => option.value
    );
    if (searchTerm !== "") {
      setOptions(
        allOptions.filter((o) =>
          o.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setOptions(allOptions);
    }
  }, [_generatedOption, options, searchTerm]);

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <div className="mb-5 w-full">
      <label
        htmlFor={inputName}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        type="hidden"
        name={inputName}
        id={inputName}
        value={_value || ""}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            aria-controls="searchbox"
            type="button"
            className={cn(
              "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full",
              "p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
              className
            )}
          >
            <span className="flex justify-between">
              {_value
                ? _options.find((option) => option.value === _value)?.label
                : `Select ${label}`}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]"
          id="searchbox"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search ..."
              className="h-9"
              onValueChange={setSearchTerm}
            />
            <CommandGroup>
              {_options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    setValue(option.value);
                    setOpen(false);
                    if (onSelectOption) {
                      onSelectOption(option);
                    }
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}

              {searchTerm && onCreateOption ? (
                <CommandItem
                  value={searchTerm}
                  key="-2"
                  onSelect={() => {
                    const value = Number.MAX_SAFE_INTEGER.toString();
                    setGeneratedOption({ label: searchTerm, value });
                    setOpen(false);
                    setSearchTerm("");
                    setValue(value);
                    onCreateOption(searchTerm);
                  }}
                  className="cursor-pointer"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add {searchTerm}
                </CommandItem>
              ) : (
                ""
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {guidance}
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
    </div>
  );
}
