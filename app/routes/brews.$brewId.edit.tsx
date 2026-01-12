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
import { DatePicker } from '@/components/form-elements/date-picker';
import { SubmitButton } from '@/components/form-elements/submit';
import { CurrencyInput } from '@/components/form-elements/currency-input';
import { getAuthenticatedClient } from '~/supabase.auth.server';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import {
	redirect,
	Form,
	useLoaderData,
	useNavigate,
	useActionData,
} from 'react-router';

const schema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(1, 'Brew Name is required'),
	brew_date: z.coerce.date(),
	duty: z.coerce.number().optional(),
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.brewId, 'Missing brewId param');

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const brew = await getBrewById(
		supabaseClient,
		userId,
		parseInt(params.brewId)
	);
	if (!brew) {
		throw new Response('Not Found', { status: 404 });
	}
	return { brew };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });

	if (submission.status !== 'success') {
		return submission.reply();
	}

	const { id, name, brew_date, duty } = submission.value;

	if (id) {
		const update: Partial<Brew> = {
			id,
			name,
			brew_date,
			duty,
		};

		const updated = await updateOneBrew(supabaseClient, update);
		return redirect(`/brews/${(updated.data as Brew).id}`);
	} else {
		const insert: Partial<Brew> = {
			name,
			brew_date,
			duty,
		};

		const inserted = await insertOneBrew(supabaseClient, insert);
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
			brew_date: brewData.brew_date?.toString() || '',
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
					className="flex flex-col flex-1"
					{...getFormProps(form)}
				>
					<DrawerHeader>
						<DrawerTitle>
							{isEditing ? 'Edit' : 'New'} Brew
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<InputHidden name="id" field={fields.id} />
						<Input label="Brew Name" field={fields.name} />
						<DatePicker
							label="Brew Date"
							field={fields.brew_date}
						/>
						<CurrencyInput
							label="Duty Amount"
							field={fields.duty}
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
