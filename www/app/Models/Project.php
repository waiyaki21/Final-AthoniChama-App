<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'user_id',
        'cycle_id',
        'name',
        'target',
        'total_expenses',
        'completed'
    ];

    protected $appends = [
        'expenses_count',
        'total_percent'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(Cycle::class, 'cycle_id');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'project_id');
    }

    public function getExpensesCountAttribute()
    {
        return $this->expenses()->count();
    }

    public function getExpensesSumAttribute()
    {
        return $this->expenses()->sum('amount');
    }

    public function getTotalPercentAttribute()
    {
        $sum        =  $this->expenses()->sum('amount');

        $info       = $this->hasOne(Project::class, 'id')->first('target');
        $target     = $info->target;

        $percent    = number_format($sum / $target * 100);

        return $percent;
    }
}
