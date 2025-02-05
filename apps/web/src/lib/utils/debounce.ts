let timer: ReturnType<typeof setTimeout>;
export const debounce = (f: () => void, ms: number) => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		f();
	}, ms);
};
