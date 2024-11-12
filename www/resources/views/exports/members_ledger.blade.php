<table class="table">
	<thead>
		<tr>
			<th>No.</th>
			<th>Members Name</th>
			<th>Telephone No.</th>
			<th>Total Contributions <br> B/F</th>
            @foreach ($cycles as $cycle)
               <th>{{ $cycle->month}} {{ $cycle->year }}</th> 
            @endforeach
            <th>Total Contributions</th>
            <th>Total Welfare</th>
            <th>Welfare Owing</th>
            <th>Total Investment</th>
		</tr>
	</thead>
	<tbody>
        @foreach($members as $index => $member)
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        @endforeach
        <tr></tr>
        <tr>
            <td></td>
            <td>TOTALS</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
	</tbody>
</table>
