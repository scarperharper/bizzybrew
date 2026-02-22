import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { getBrewById, insertOneBrew, updateOneBrew } from '@/data/api/BrewApi';
import { Brew } from '@/data/models/Brew';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4';
import { useForm, getFormProps } from '@conform-to/react';
import { InputHidden } from '@/components/form-elements/input-hidden';
import { Input } from '@/components/form-elements/input';
import { SubmitButton } from '@/components/form-elements/submit';
import { CurrencyInput } from '@/components/form-elements/currency-input';
import { FileInput } from '@/components/form-elements/file-input';
import { authContext } from '~/context';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import {
	redirect,
	Form,
	useLoaderData,
	useNavigate,
	useActionData,
} from 'react-router';
import { format } from 'date-fns';

const schema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, 'Brew Name is required'),
	brew_date: z.coerce.date(),
	duty: z.coerce.number().optional(),
	image: z.instanceof(File).optional(),
});

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.brewId, 'Missing brewId param');

	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const brew = await getBrewById(supabaseClient, parseInt(params.brewId));
	if (!brew) {
		throw new Response('Not Found', { status: 404 });
	}
	return { brew };
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = context.get(authContext);

	if (!userId) {
		return redirect('/sign-in');
	}

	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== 'success') {
		return submission.reply();
	}

	const { id, name, brew_date, duty, image } = submission.value;

	let image_url: string | undefined;

	if (image && image.size > 0) {
		const fileExt = image.name.split('.').pop();
		const fileName = `${userId}/${Date.now()}.${fileExt}`;

		const { data: uploadData, error: uploadError } =
			await supabaseClient.storage
				.from('images')
				.upload(fileName, image, {
					cacheControl: '3600',
					upsert: false,
				});

		if (uploadError) {
			return submission.reply({
				formErrors: [`Failed to upload image: ${uploadError.message}`],
			});
		}

		image_url = uploadData.path;
	}

	if (id) {
		const update: Partial<Brew> = {
			id,
			name,
			brew_date,
			duty,
			...(image_url && { image_url }),
		};

		const updated = await updateOneBrew(supabaseClient, update);
		return redirect(`/brews/${(updated.data as Brew).id}`);
	} else {
		const insert: Partial<Brew> = {
			name,
			brew_date,
			duty,
			...(image_url && { image_url }),
		};

		const inserted = await insertOneBrew(supabaseClient, userId, insert);
		return redirect(`/brews/${(inserted.data as Brew).id}`);
	}
};

export default function Editbrew() {
	const { brew } = useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();
	const brewData = brew.data as unknown as Brew;

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			id: brewData.id?.toString() || '',
			name: brewData.name || '',
			brew_date: format(brewData.brew_date, 'yyyy-MM-dd'),
			duty: brewData.duty?.toString() || '0',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const isEditing = brewData.id !== undefined;

	return (
		<Drawer
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DrawerContent>
				<Form
					method="post"
					encType="multipart/form-data"
					className="flex flex-col flex-1"
					{...getFormProps(form)}
				>
					<DrawerHeader>
						<DrawerTitle>
							{isEditing ? 'Edit' : 'New'} Brew
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<InputHidden
							name="id"
							defaultValue={fields.id.defaultValue}
						/>
						<Input
							label="Brew Name"
							defaultValue={fields.name.defaultValue}
							name="name"
							errors={fields.name.errors}
							type="text"
						/>
						<Input
							label="Brew Date"
							defaultValue={fields.brew_date.defaultValue}
							name="brew_date"
							errors={fields.brew_date.errors}
							type="date"
						/>
						<CurrencyInput
							label="Duty Amount"
							name="duty"
							defaultValue={fields.duty.defaultValue}
							errors={fields.duty.errors}
						/>
						<FileInput
							label="Brew Image"
							name="image"
							errors={fields.image?.errors}
							currentImage={brewData.image_url}
						/>
					</DrawerBody>
					<DrawerFooter>
						<SubmitButton />
						<Button onClick={onClose} type="reset">
							Cancel
						</Button>
					</DrawerFooter>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
