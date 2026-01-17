import { cn } from '@/lib/utils';

type InputProps = {
	name: string;
	label: string;
	options: { value: string; label: string }[];
	errors: string[] | undefined;
	selectProps: {
		key: string | undefined;
		id: string;
		name: string;
		form: string;
		required?: boolean | undefined;
		'aria-describedby'?: string | undefined;
		'aria-invalid'?: boolean | undefined;
		defaultValue?: string | number | readonly string[] | undefined;
		multiple?: boolean | undefined;
	};
};

export const Select = ({
	name,
	label,
	errors,
	options,
	selectProps,
}: InputProps) => {
	return (
		<div className="mb-5 w-full">
			<label
				htmlFor={name}
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				{label}
			</label>

			<select
				{...selectProps}
				className={cn(
					'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
				)}
			>
				<option value="-1">-- select an option --</option>
				{options.map((option) => (
					<option value={option.value} key={option.value}>
						{option.label}
					</option>
				))}
			</select>

			<p className="mt-2 text-sm text-red-600 dark:text-red-500">
				{errors}
			</p>
		</div>
	);
};
