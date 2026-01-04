import { data, redirect } from 'react-router';
import { Form, useActionData } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from '~/supabase.server';
import { Button } from '@/components/ui/button';

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabaseClient, headers } = createSupabaseServerClient(request);
	const formData = await request.formData();
	const { error } = await supabaseClient.auth.signInWithPassword({
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	});

	if (error) {
		return data({ success: false }, { headers });
	}

	return redirect('/', {
		headers,
	});
};

const SignIn = () => {
	const actionResponse = useActionData<typeof action>();
	return (
		<>
			{!actionResponse?.success ? (
				<section className="bg-gray-50 dark:bg-gray-900">
					<div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
						<Form
							method="post"
							className="animate-in flex-1 flex flex-col justify-center gap-2 text-foreground"
						>
							<label className="text-md" htmlFor="email">
								Email
							</label>
							<input
								className="rounded-md px-4 py-2 bg-inherit border mb-6"
								name="email"
								placeholder="you@example.com"
								required
							/>
							<label className="text-md" htmlFor="password">
								Password
							</label>
							<input
								className="rounded-md px-4 py-2 bg-inherit border mb-6"
								type="password"
								name="password"
								placeholder="••••••••"
								required
							/>
							<Button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
								Sign In
							</Button>
							{/* <SubmitButton
                formAction={signUp}
                className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
                pendingText="Signing Up..."
              >
                Sign Up
              </SubmitButton>
              {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                  {searchParams.message}
                </p>
              )} */}
						</Form>
					</div>
				</section>
			) : (
				<h3>Please check your email.</h3>
			)}
		</>
	);
};
export default SignIn;
