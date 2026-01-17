import { getInputProps, type FieldMetadata } from '@conform-to/react';

type InputHiddenProps = {
	name: string;
	defaultValue?: string | number | readonly string[] | undefined;
	field?: FieldMetadata<string>;
};

export const InputHidden = ({
	name,
	defaultValue,
	field,
}: InputHiddenProps) => {
	// If field is provided, use conform's getInputProps, otherwise just render a plain hidden input
	if (field) {
		return (
			<div>
				<input {...getInputProps(field, { type: 'hidden' })} />
			</div>
		);
	}

	return (
		<div>
			<input
				type="hidden"
				name={name}
				defaultValue={defaultValue}
				id={name}
			/>
		</div>
	);
};
