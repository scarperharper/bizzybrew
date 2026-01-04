import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export function SubmitButton({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<Button
			type="submit"
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-primary-foreground hover:bg-secondary/90 shadow-sm h-8 text-sm rounded-md px-4',
				className
			)}
		>
			{children}
		</Button>
	);
}
