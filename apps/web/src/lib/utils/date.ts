export function formatDate(dateStr: string) {
	const date = new Date(dateStr);

	return date
		.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		})
		.toLowerCase();
}
