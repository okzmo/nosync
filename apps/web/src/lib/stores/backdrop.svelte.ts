class Backdrop {
	active = $state(false);
	blur = $state(false);

	setBlur(value: boolean) {
		this.blur = value;
	}

	set(value: boolean) {
		this.active = value;
	}
}

export const backdrop = new Backdrop();
