<table class="table">
	<thead>
		<tr>
			<th>No.</th>
			<th>Members Name</th>
			<th>Telephone No.</th>
			{{-- <th>Total Contributions <br> B/F</th> --}}
            {{-- @foreach ($cycles as $cycle)
               <th>{{ $cycle->month }} {{ $cycle->year }}</th> 
            @endforeach --}}
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
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
                {{-- <td>{{ $member->amount_before }}</td> --}}
                {{-- @foreach ($cycles as $cycle)
                    @foreach ($cycle->payments as $payment)
                        @if ($payment->member_id == $member->id)
                            <td>{{ $payment->payment }}</td>
                        @endif
                    @endforeach
                @endforeach --}}
                {{-- @foreach ($pays as $payment)
                    @if ($payment->member_id == $member->id)
                        <td>{{ $payment->sum }}</td>
                    @endif
                @endforeach
                @foreach ($exp as $welfare)
                    @if ($welfare->member_id == $member->id)
                        <td>{{ $welfare->sum }}</td>
                    @endif
                @endforeach
                @foreach ($owes as $owe)
                    @if ($owe->member_id == $member->id)
                        <td>{{ $owe->sum }}</td>
                    @endif
                @endforeach
                @foreach ($pays as $payment)
                    @if ($payment->member_id == $member->id)
                        @foreach ($exp as $welfare)
                            @if ($welfare->member_id == $member->id)
                                @foreach ($owes as $owe)
                                    @if ($owe->member_id == $member->id)
                                        <td>
                                            {{ $payment->sum - $welfare->sum - $owe->sum }}
                                        </td>
                                    @endif
                                @endforeach
                            @endif
                        @endforeach
                    @endif
                @endforeach --}}
                {{-- <td>{{ $member->payments_total }}</td> --}}
                {{-- <td>{{ $member->welfare_total }}</td> --}}
                {{-- <td>{{ $member->welfare_owing }}</td> --}}
                {{-- <td>{{ $member->total_amount }}</td> --}}
            </tr>
        @endforeach
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
