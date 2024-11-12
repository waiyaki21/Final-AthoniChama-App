<?php

namespace App\Notifications;

use App\Models\Cycle;
use App\Models\Payment;
use App\Models\Welfare;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class UploadLedger extends Notification
{
    use Queueable;

    private $year;

    public function __construct($year)
    {
        $this->year = $year;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $cycles     = Cycle::where('year', $this->year)
                                ->count();

        $cyclesid   = DB::table('cycles')->where('year', $this->year)
                                ->get('id');

        $payments   = Payment::whereBetween('cycle_id', [$cyclesid->first()['id'], $cyclesid->last()['id']])
                                ->count();

        $welfares   = Welfare::whereBetween('cycle_id', [$cyclesid->first()['id'], $cyclesid->last()['id']])
                                ->count();

        return [
            'message'       => $cycles . " Payment Cycles,". $payments ." Payments ". $welfares ." Welfares have been added successfully!",
        ];
    }
}
