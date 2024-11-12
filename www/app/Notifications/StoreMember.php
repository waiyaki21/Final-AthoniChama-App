<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StoreMember extends Notification
{
    use Queueable;

    private $member;

    public function __construct($member)
    {
        $this->member = $member;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message'       => $this->member->name . " has been added successfully!",
            'member_id'     => $this->member->id,
        ];
    }
}
