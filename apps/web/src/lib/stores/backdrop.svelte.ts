class Backdrop {
	active = $state(false);
	blur = $state(false);

	setBlur(value: boolean) {
		this.blur = value;
	}

	set(value: boolean) {
		this.active = value;
	}

	open() {
		this.active = true;
		this.blur = true;
	}

	close() {
		this.active = false;
		this.blur = false;
	}
}

export const backdrop = new Backdrop();
