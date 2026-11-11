function PropTable(props: { title: string; rows: any[]; }) {
	return <>
		<h4>{props.title}</h4>
		<table class="table table-bordered">
			<thead class="thead-subtle">
				<tr>
					<th>属性</th>
					<th>说明</th>
					<th>类型</th>
					<th>可选</th>
				</tr>
			</thead>
			<tbody>
				{props.rows.map(p => <tr>
					<td><code>{p.name}</code></td>
					<td>{p.comment}</td>
					<td><code>{p.type}</code></td>
					<td>{p.optional ? "是" : "否"}</td>
				</tr>)}
			</tbody>
		</table>
	</>;
}

export default function GridApiCard() {
	const rowProps = import.meta.tsdoc.RowProps;
	const colProps = import.meta.tsdoc.ColProps;
	return <div class="card">
		<div class="card-body">
			<h4>API 文档</h4>
			<PropTable title="Row" rows={rowProps} />
			<PropTable title="Col" rows={colProps} />
		</div>
	</div>;
}
