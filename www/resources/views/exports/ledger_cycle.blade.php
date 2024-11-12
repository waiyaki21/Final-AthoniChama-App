<table class="table">
	<thead>
		<tr>
			<th>No.</th>
			<th>Members Name</th>
			<th>Telephone No.</th>
			{{-- <th>Total Contributions <br> B/F</th> --}}
            @foreach ($cycles as $cycle)
               <th>{{ $cycle->month}}</th> 
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
                <td>{{ $member->id }}</td>
                <td>{{ $member->name }}</td>
                <td>{{ $member->telephone }}</td>
                {{-- <td>{{ number_format($member->amount_before) }}</td> --}}
                @foreach ($cycles as $cycle)
                    @foreach ($cycle->payments as $payment)
                        @if ($payment->member_id == $member->id)
                            <td>{{ number_format($payment->payment) }}</td>
                        @endif
                    @endforeach
                @endforeach
                @foreach ($pays as $payment)
                    @if ($payment->member_id == $member->id)
                        <td>{{ number_format($payment->sum) }}</td>
                    @endif
                @endforeach
                @foreach ($exp as $welfare)
                    @if ($welfare->member_id == $member->id)
                        <td>{{ number_format($welfare->sum) }}</td>
                    @endif
                @endforeach
                @foreach ($owes as $owe)
                    @if ($owe->member_id == $member->id)
                        <td>{{ number_format($owe->sum) }}</td>
                    @endif
                @endforeach
                @foreach ($pays as $payment)
                    @if ($payment->member_id == $member->id)
                        @foreach ($exp as $welfare)
                            @if ($welfare->member_id == $member->id)
                                @foreach ($owes as $owe)
                                    @if ($owe->member_id == $member->id)
                                        <td>
                                            {{ number_format($payment->sum - $welfare->sum - $owe->sum) }}
                                        </td>
                                    @endif
                                @endforeach
                            @endif
                        @endforeach
                    @endif
                @endforeach
                {{-- <td>{{ number_format($member->payments_total) }}</td> --}}
                {{-- <td>{{ number_format($member->welfare_total) }}</td> --}}
                {{-- <td>{{ number_format($member->welfare_owing) }}</td> --}}
                {{-- <td>{{ number_format($member->total_amount) }}</td> --}}
            </tr>
        @endforeach
	</tbody>
</table>
