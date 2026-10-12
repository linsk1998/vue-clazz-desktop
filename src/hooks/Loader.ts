import { State, ViewModel } from "vue-clazz-decorator";

@ViewModel
export class Loader {
	@State
	public loading: boolean = false;

	@State
	public error: Error | null = null;

	public execute<T, U extends Array<any>>(fn: (...args: U) => (Promise<T> | void), args: U) {
		this.loading = true;
		this.error = null;
		var promise;
		try {
			promise = fn(...args);
			if(promise && typeof promise.then === 'function') {
				promise.then(result => {
					this.loading = false;
				}, error => {
					this.loading = false;
					this.error = error;
				});
			} else {
				this.loading = false;
			}
		} catch(e) {
			this.error = e;
			this.loading = false;
		}
		return promise;
	}
}
