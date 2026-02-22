import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { LinksFunction, MiddlewareFunction } from 'react-router';
import stylesheet from '~/tailwind.css?url';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from 'next-themes';
import { authContext } from '~/context';
import { getAuthenticatedClient } from '~/supabase.auth.server';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
];

export const middleware: MiddlewareFunction[] = [
	async ({ request, context }) => {
		const authResult = await getAuthenticatedClient(request);
		context.set(authContext, authResult);
	},
];

export async function loader() {
	return null;
}

export default function App() {
	return (
		<html lang="en" suppressHydrationWarning className="h-full bg-gray-100">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<Meta />
				<Links />
			</head>
			<body className="min-h-full">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex-col md:flex">
						<div className="container mx-auto">
							<Header />
							<Outlet />
						</div>
					</div>
				</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
