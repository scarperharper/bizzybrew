import { cn } from '@/lib/utils';

type InputProps = {
	className?: string;
	defaultValue: string | number | readonly string[] | undefined;
	errors: string[] | undefined;
	name: string;
	label: string;
	type: 'date' | 'number' | 'password' | 'text';
};

export const Input = ({
	className,
	defaultValue,
	errors,
	name,
	label,
	type = 'text',
}: InputProps) => {
	return (
		<div className="mb-5 w-full">
			<label
				htmlFor={name}
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				{label}
			</label>
			<input
				type={type}
				key={name}
				name={name}
				defaultValue={defaultValue}
				className={cn(
					'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
					className,
				)}
			/>
			<p className="mt-2 text-sm text-red-600 dark:text-red-500">
				{errors}
			</p>
		</div>
	);
};
