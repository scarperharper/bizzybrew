export const Currency = ({ amount }: { amount: number }) => {
	const format = (num: number): string =>
		'£' + (num / 100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	return <span>{format(amount)}</span>;
};
