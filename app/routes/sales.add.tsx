import { Button } from '@/components/ui/button';
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
	redirect,
	Form,
	useLoaderData,
	useNavigate,
	useSubmit,
	useActionData,
} from 'react-router';
import { z } from 'zod';
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4';
import {
	useForm,
	getFormProps,
	type SubmissionResult,
} from '@conform-to/react';
import { SubmitButton } from '@/components/form-elements/submit';
import { Combobox } from '@/components/local/combobox';
import { getCustomers, insertOneCustomer } from '@/data/api/CustomerApi';
import { Customer } from '@/data/models/Customer';
import { insertOneSale } from '@/data/api/SaleApi';
import { Sale } from '@/data/models/Sale';
import { getAuthenticatedClient } from '~/supabase.auth.server';
import { Input } from '@/components/form-elements/input';
import { format } from 'date-fns';

const saleSchema = z.object({
	created_at: z.coerce.date(),
	customer_id: z.coerce.number().positive('Please select an option'),
});

const createCustomerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const [customersResult] = await Promise.all([getCustomers(supabaseClient)]);
	if (!customersResult.success) {
		throw new Response(`Error getting data`, { status: 500 });
	}
	return { customersResult };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabaseClient, userId } = await getAuthenticatedClient(request);

	if (!userId) {
		return redirect('/sign-in');
	}

	const formData = await request.formData();
	const intent = formData.get('intent');

	if (intent == 'createCustomer') {
		const submission = parseWithZod(formData, {
			schema: createCustomerSchema,
		});
		if (submission.status !== 'success') {
			return submission.reply();
		}
		return await insertOneCustomer(supabaseClient, userId, {
			created_at: new Date(),
			name: submission.value.name,
		});
	} else if (intent == 'addSale') {
		const submission = parseWithZod(formData, { schema: saleSchema });
		if (submission.status !== 'success') {
			return submission.reply();
		}
		const created = await insertOneSale(supabaseClient, userId, {
			...submission.value,
			total_amount: 0,
		});

		return redirect(`/sales/${(created.data as Sale).id}`);
	}
};

export default function AddSale() {
	const { customersResult } = useLoaderData<typeof loader>();
	const lastResult = useActionData<SubmissionResult<string[]>>();
	const customers = customersResult.data as unknown as Customer[];

	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(saleSchema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		defaultValue: {
			created_at: format(new Date(), 'yyyy-MM-dd'),
			customer_id: '',
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: saleSchema });
		},
	});

	const navigate = useNavigate();
	const onClose = () => navigate(-1);

	const customersOptions = (customers || []).map((line) => ({
		value: line.id.toString(),
		label: `${line.name}`,
	}));

	const submit = useSubmit();

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
						<DrawerTitle>New Sale</DrawerTitle>
					</DrawerHeader>

					<DrawerBody>
						<Input
							label="Sale Date"
							name="created_at"
							defaultValue={fields.created_at.defaultValue}
							errors={fields.created_at.errors}
							type="date"
						/>
						<Combobox
							label="Customer"
							options={customersOptions}
							guidance={''}
							field={fields.customer_id}
							onCreateOption={(option) => {
								submit(
									{ name: option, intent: 'createCustomer' },
									{ method: 'post' },
								);
							}}
						/>
					</DrawerBody>
					<DrawerFooter>
						<SubmitButton
							name="intent"
							value="addSale"
							submitText="Save"
							submittingText="Saving..."
						/>
						<Button onClick={onClose} type="reset">
							Cancel
						</Button>
					</DrawerFooter>
				</Form>
			</DrawerContent>
		</Drawer>
	);
}
