import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { type ReactNode } from 'react';
import { Form } from 'react-router';

export function ConfirmActionButton({
	action,
	children,
	className,
}: {
	action: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className={className}>
					{children}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[425px]"
				onPointerDownOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>Confirm</DialogTitle>
					<DialogDescription>
						Are you sure you wish to {children}?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Cancel</Button>
					</DialogClose>
					<DialogClose asChild>
						<Form id="destroyForm" method="post" action={action}>
							<Button>Confirm</Button>
						</Form>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
