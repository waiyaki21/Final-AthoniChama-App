<table class="table">
	<thead>
		<tr>
			<th>ID</th>
			<th>Members Name</th>
			<th>Contributions</th>
			<th>Welfare In</th>
			<th>Welfare Owing</th>
			{{-- <th>Total Welfare</th> --}}
			{{-- <th>New Total Welfares</th> --}}
			{{-- <th>New Total Contributions</th> --}}
		</tr>
	</thead>
	<tbody>
		{{-- this is for the filling in of a new cycle  --}}
        @foreach($members as $index => $member)
            <tr>
                <td></td>
                <td></td>
                <td></td>
				<td></td>
				<td></td>
				{{-- <td></td>
				<td></td>
				<td></td> --}}
            </tr>
        @endforeach
		<tr>
			<td></td>
			<th>Totals</th>
			<td></td>
			<td></td>
			<td></td>
			{{-- <td></td>
			<td></td>
			<td></td> --}}
		</tr>
	</tbody>
</table>
