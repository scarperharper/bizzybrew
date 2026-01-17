import { cn } from '@/lib/utils';
import { NumberFormatBase } from 'react-number-format';
import { currency } from '../data/tables/formatters/currency';
import { getSignificantDigitCount } from '@/utils/significant-digits';
import { useState, useEffect } from 'react';

export type CurrencyInputProps = {
	name: string;
	label: string;
	errors: string[] | undefined;
	className?: string;
	defaultValue?: string;
};

export const boundary = (formattedValue: string): boolean[] => {
	const numberValue = formattedValue.replace(/[^\d]/g, '');
	const significantDigits = getSignificantDigitCount(parseInt(numberValue));
	const boundaries = Array.from({
		length: formattedValue.length + 1,
	}).map(() => false);
	for (let i = 0; i < significantDigits; i++) {
		const position = boundaries.length - i - (i > 2 ? 2 : 1);
		boundaries[position] = true;
	}
	return boundaries;
};

export const CurrencyInput = ({
	errors,
	name,
	defaultValue,
	label,
	className,
}: CurrencyInputProps) => {
	const [value, setValue] = useState(defaultValue || '0');

	// Sync with field value when it changes externally (e.g., via form.update())
	useEffect(() => {
		if (value !== undefined) {
			setValue(value);
		}
	}, [value]);

	return (
		<div className="mb-5 w-full">
			<label
				htmlFor={name}
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				{label}
			</label>
			<input type="hidden" name={name} id={name} value={value} />

			<NumberFormatBase
				value={value}
				onValueChange={(values) => {
					setValue(values.value);
				}}
				className={cn(
					'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
					className,
				)}
				format={(numString: string) => currency(parseInt(numString))}
				getCaretBoundary={(formattedValue: string) =>
					boundary(formattedValue)
				}
			/>

			<p className="mt-2 text-sm text-red-600 dark:text-red-500">
				{errors}
			</p>
		</div>
	);
};
