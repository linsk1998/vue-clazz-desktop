import { Inject, State, ViewModel } from "vue-clazz-decorator";

@ViewModel
export class Action {
	@Inject
	private onActionError: (error: any) => any;

	@State
	public pending: boolean = false;

	@State
	public error: Error | null = null;

	public execute<T, U extends Array<any>>(fn: (...args: U) => (Promise<T> | void), args: U) {
		if(this.pending) return;
		this.pending = true;
		this.error = null;
		var promise;
		try {
			promise = fn(...args);
			if(promise && typeof promise.then === 'function') {
				promise.then(result => {
					this.pending = false;
				}, error => {
					this.pending = false;
					this.error = error;
					this.onActionError?.(error);
				});
			} else {
				this.pending = false;
			}
		} catch(error) {
			this.pending = false;
			this.error = error;
			this.onActionError?.(error);
		}
		return promise;
	}
}
