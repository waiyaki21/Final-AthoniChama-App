<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

use App\Models\User;

class NotificationController extends Controller
{
    public function getNotifications() 
    {
        $not = auth()->user()->unreadnotifications;
        return $not;
    }

    public function markAsRead($id)
    {
        $notificationId = request('notification_id');

        $userUnreadNotification = auth()->user()
                                    ->unreadNotifications
                                    ->where('id', $id)
                                    ->first();

        // return $userUnreadNotification->data['order_id'];
        $message = $userUnreadNotification->data['message'];

        if($userUnreadNotification) {
            $userUnreadNotification->markAsRead();
        }

        // $link = '/member/'. $userUnreadNotification->data['member_id'];

        // session()->flash('info', $message);
    
        // return redirect($link);
    }

    public function markCycleAsRead($id)
    {
        $notificationId = request('notification_id');

        $userUnreadNotification = auth()->user()
                                    ->ordersPaidNotifications
                                    ->where('id', $id)
                                    ->first();

        // return $userUnreadNotification;
        $message = $userUnreadNotification->data['message'];

        if($userUnreadNotification) {
            $userUnreadNotification->markAsRead();
        }

        $link = '/cycle/'. $userUnreadNotification->data['cycle_id'];

        session()->flash('info', $message);
    
        return redirect($link);
    }

    // public function markRejectAsRead($id)
    // {
    //     $notificationId = request('notification_id');

    //     $userUnreadNotification = auth()->user()
    //                                 ->unreadNotifications
    //                                 ->where('id', $id)
    //                                 ->first();

    //     // return $userUnreadNotification->data['order_id'];
    //     $message = $userUnreadNotification->data['message'];

    //     if($userUnreadNotification) {
    //         $userUnreadNotification->markAsRead();
    //     }

    //     // get Order
    //     $order = Order::find($userUnreadNotification->data['order_id']);

    //     if (Auth::user()->role == 'admin' || Auth::user()->role == 'employer') {
    //         $link = '/orders_unassigned/'. $order->employer_id;
    //     } elseif(Auth::user()->role == 'writer') {
    //         $link = '/writer_order/'. $userUnreadNotification->data['order_id'];
    //     }

    //     session()->flash('info', $message);
    
    //     return redirect($link);
    // }

    public function markAllAsRead()
    {
        $user = User::findOrFail(auth()->id());

        $user->unreadNotifications->markAsRead();

        // session()->flash('success', "All Notifications Marked As Read");  

        // return back();
    }
}
