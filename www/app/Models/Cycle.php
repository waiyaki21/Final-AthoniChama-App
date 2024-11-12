<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cycle extends Model
{
    use HasFactory;

    // use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'user_id',
        'name',
        'date',
        'month',
        'year',
        'amount',
        'welfare_amnt',
        'members_no',
        'total',
        'percent',
        'completed'
    ];

    protected $appends = [
        'payments_total',
        'welfares_total',
        'welfaresin_total',
        'welfaresowed_total',
        'expenses_total',
        'total_amount',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function payments(): HasMany
    {
        return $this->HasMany(Payment::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function expenses(): HasMany
    {
        return $this->HasMany(Expense::class);
    }

    public function cycleExpenses(): HasMany
    {
        return $this->HasMany(CycleExpense::class);
    }

    public function getPaymentsTotalAttribute()
    {
        return $this->payments()->sum('payment');
    }

    public function welfares(): HasMany
    {
        return $this->HasMany(Welfare::class)->with('member:id,name,welfare_before');
    }

    public function welfaresIn(): HasMany
    {
        return $this->HasMany(Welfare::class)->where('type', 1)->with('member:id,name,welfare_before');
    }

    public function welfaresOwed(): HasMany
    {
        return $this->HasMany(Welfare::class)->where('type', 0)->with('member:id,name,welfare_before');
    }

    public function getWelfaresTotalAttribute()
    {
        return $this->welfares()->sum('payment');
    }

    public function getWelfaresinTotalAttribute()
    {
        return $this->HasMany(Welfare::class)->where('type', 1)->sum('payment');
    }

    public function getWelfaresowedTotalAttribute()
    {
        return $this->HasMany(Welfare::class)->where('type', 0)->sum('payment');
    }

    public function getTotalAmountAttribute()
    {
        $info    = $this->hasOne(Cycle::class, 'id')->first();

        $total   = intval($info->payments_total) + intval($info->welfares_total);

        return $total;
    }

    public function getExpensesTotalAttribute()
    {
        $expTotal       =  $this->expenses()->sum('amount');
        $cycleexpTotal  =  $this->cycleExpenses()->sum('amount');

        $total          = $expTotal + $cycleexpTotal;

        return $total;
    }
}
