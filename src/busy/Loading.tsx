export interface LoadingProps {
	inline?: boolean;
	fill?: boolean;
}

export function Loading(props: LoadingProps) {
	const { inline, fill } = props;
	return fill ?
		<div class="icon-center icon-middle loading-spin">Loading...</div> :
		inline ? <div class="loading-grow text-info"></div> :
			<div class="text-center text-info">
				<div class="loading-spin"></div>
			</div>;
}
