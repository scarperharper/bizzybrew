import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import {
	Form,
	redirect,
	useActionData,
	useLoaderData,
	useNavigate,
} from 'react-router';
import invariant from 'tiny-invariant';
import {
	getReceiptById,
	insertOneReceipt,
	updateOneReceipt,
} from '@/data/api/ReceiptApi';
import { Receipt } from '@/data/models/Receipt';
import { getAuthenticatedClient } from '~/supabase.auth.server';
import { z } from 'zod';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { InputHidden } from '@/components/form-elements/input-hidden';
import { SubmitButton } from '@/components/form-elements/submit';
import { Button } from '@/components/ui/button';

const schema = z.object({
	id: z.number(),
	description: z.string(),
	date: z.date(),
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.receiptId, 'Missing receiptId param');

	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const receiptResponse = await getReceiptById(
		supabaseClient,
		userId,
		parseInt(params.receiptId)
	);
	if (!receiptResponse.success) {
		throw new Response('Error loading receipt', { status: 404 });
	}
	return { defaultValue: receiptResponse.data as Receipt };
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

	if (submission.value.id) {
		const updated = await updateOneReceipt(
			supabaseClient,
			userId,
			submission.value
		);
		return redirect(`/receipts/${(updated.data as Receipt).id}`);
	} else {
		const inserted = await insertOneReceipt(
			supabaseClient,
			userId,
			submission.value
		);
		return redirect(`/receipts/${(inserted.data as Receipt).id}`);
	}
};

export default function EditReceipt() {
	const { defaultValue } = useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		defaultValue: defaultValue,
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const isEditing = true; // TODO

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
							{isEditing ? 'Edit' : 'New'} Receipt
						</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<InputHidden name="id" />
						<input
							{...getInputProps(fields.description, {
								type: 'text',
							})}
						/>
						<input
							{...getInputProps(fields.date, {
								type: 'datetime-local',
							})}
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
