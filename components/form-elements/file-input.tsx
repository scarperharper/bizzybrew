import { cn } from '@/lib/utils';

type FileInputProps = {
	className?: string;
	errors: string[] | undefined;
	name: string;
	label: string;
	accept?: string;
	currentImage?: string;
};

export const FileInput = ({
	className,
	errors,
	name,
	label,
	accept = 'image/*',
	currentImage,
}: FileInputProps) => {
	return (
		<div className="mb-5 w-full">
			<label
				htmlFor={name}
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>
				{label}
			</label>
			{currentImage && (
				<div className="mb-3">
					<img
						src={currentImage}
						alt="Current"
						className="max-w-xs max-h-48 rounded-lg border border-gray-300 dark:border-gray-600"
					/>
				</div>
			)}
			<input
				type="file"
				key={name}
				name={name}
				accept={accept}
				className={cn(
					'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 file:mr-5 file:p-2.5 file:bg-gray-500 hover:file:cursor-pointer ',
					className,
				)}
			/>
			<p className="mt-2 text-sm text-red-600 dark:text-red-500">
				{errors}
			</p>
		</div>
	);
};
