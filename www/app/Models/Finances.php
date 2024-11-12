<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Finances extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'user_id',
        // cycles no 
        'cycles_no',

        // payments 
        'total_pays',

        // projects and expenses 
        'projects_no',
        'projects_comp',
        'total_expenses',

        // welfares
        'welfare_in',
        'welfare_out',
        'total_welfare',

        // Totals 
        'money_left',
        'money_out',
        'all_money',

        // Percent 
        'percentage',

        // defaults 
        'payment_def',
        'welfare_def'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
