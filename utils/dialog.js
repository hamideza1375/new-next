const confirmPolyfill = (title, {ok, cancel}) => {
	// نمایش دیالوگ تاییدیه
	const result = window.confirm(title)
	if (result) {
		// اگر تایید شد
		ok(result)
	} else {
		// اگر لغو شد
		cancel()
	}
}


// promptForce
// const promptPolyfill = (title, {ok, cancel}) => {
//  let result;
//  do {
// 	result = window.prompt(title);
//  } while (!result);
 
//  ok(result);
// }

const dialog = { /* prompt: promptPolyfill, */ confirm: confirmPolyfill };
export default dialog;