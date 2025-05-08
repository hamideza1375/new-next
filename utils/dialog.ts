interface DialogCallbacks<T = boolean> {
	ok: (result: T) => void;
	cancel: () => void;
}

/**
* @example
* dialog.confirm("Are you sure?", {
*   ok: () => console.log("Confirmed"),
*   cancel: () => console.log("Cancelled")
* });
*/
const confirmPolyfill = (title: string, { ok, cancel }: DialogCallbacks<boolean>): void => {
	const result = window.confirm(title);
	result ? ok(result) : cancel();
};


const promptPolyfill = (title: string, { ok }: DialogCallbacks<string>): void => {
	let result: string | null;

	do {
		 result = window.prompt(title);
	} while (result === null || result.trim() === '');

	ok(result!); // Non-null assertion safe due to while loop
};


const dialog = {
	// prompt: promptPolyfill, // Uncomment if needed
	confirm: confirmPolyfill
} as const;

export default dialog;
