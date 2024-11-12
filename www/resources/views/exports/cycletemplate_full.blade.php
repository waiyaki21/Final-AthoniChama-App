<table class="table">
	<thead>
		<tr>
			<th>No.</th>
			<th>Members Name</th>
			<th>Telephone No.</th>
			<th>Total Contributions B/F</th>
            {{-- <th>Total Welfare B/F</th> --}}
            <th>JANUARY</th>
            <th>FEBRUARY</th>
            <th>MARCH</th>
            <th>APRIL</th>
            <th>MAY</th>
            <th>JUNE</th>
            <th>JULY</th>
            <th>AUGUST</th>
            <th>SEPTEMBER</th>
            <th>OCTOBER</th>
            <th>NOVEMBER</th>
            <th>DECEMBER</th>
            <th>Total Contributions</th>
            <th>Total Welfare</th>
            <th>Welfare Owing</th>
            <th>Total Investment</th>
            {{-- <th>Age</th> --}}
		</tr>
	</thead>
	<tbody>
        @foreach($members as $index => $member)
            <tr>
                <td>{{ $member->id }}</td>
                <td>{{ $member->name }}</td>
                <td>{{ $member->telephone }}</td>
                <td>{{ $member->amount_before }}</td>
                {{-- <td>{{ $member->welfare_before }}</td> --}}
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
                <td>{{ $member->payments_total }}</td>
                <td>{{ $member->welfare_total }}</td>
                <td>{{ $member->welfare_out }}</td>
                <td>{{ $member->total_amount }}</td>
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
