import { getInputProps, type FieldMetadata } from '@conform-to/react';
import { cn } from '@/lib/utils';

type InputProps = {
	name?: string;
	label: string;
	className?: string;
	field?: FieldMetadata<object>;
	inputType?: Parameters<typeof getInputProps>[1]['type'];
};

export const Input = ({
	name,
	label,
	className,
	field,
	inputType = 'text',
}: InputProps) => {
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
				{...(field
					? getInputProps(field, { type: inputType })
					: { name: inputName, id: inputName, type: inputType })}
				className={cn(
					'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
					className
				)}
			/>
			<p className="mt-2 text-sm text-red-600 dark:text-red-500">
				{error}
			</p>
		</div>
	);
};
