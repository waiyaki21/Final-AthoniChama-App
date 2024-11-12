<?php

namespace App\Http\Controllers\ExcelUploads;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Welfare;
use App\Notifications\StoreMember;
use Illuminate\Support\Facades\DB;
use App\Notifications\UpdateMember;
use App\Http\Controllers\Controller;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\FinancesController;
use Illuminate\Support\Facades\Notification;

class LedgersExcelController extends Controller
{
    // check year 
    public function yearCheck($year) 
    {
        $before1 = $year - 1;
        $before2 = $year - 2;

        if (Cycle::where('year', $before1)->exists()) {
            $ledger = true;
        } else {
            $ledger = false;
        }

        return $ledger;
    }

    // enter members
    public function memberArray($new)
    {
        // create array 
        $OGmembers = array();

        // foreach excel row 
        foreach ($new as $row) {
            // new member info 
            $phone      = $row[2];
            $before     = $row[3];

            if ($row[17] == null) {
                $welfare = '0';
            } else {
                $welfare = $row[17];
            }

            if ($row[18] == null) {
                $welfareowed = '0';
            } else {
                $welfareowed = intval($row[18]);
            }

            $newphone       = str_replace(',', '', $phone);
            $newbefore      = str_replace(',', '', $before);
            $newwelfare     = str_replace(',', '', $welfare);
            $newwelfareowed = str_replace(',', '', $welfareowed);

            try {

                if (Member::where([['name', $row[1]], ['id', $row[0]]])->exists()) {

                    $member = Member::where([['name', $row[1]], ['id', $row[0]]])->first();

                    // update the member if its an existing name appearing 
                    Member::where('id', $member->id)->update([
                        // 'amount_before'         => $newbefore,
                        'welfare_before'        => $newwelfare,
                        'welfareowed_before'    => abs($newwelfareowed),
                    ]);

                    // // send notification
                    // $user = User::where('id', auth()->id())->first();
                    // Notification::send($user, new UpdateMember($member));
                    
                } else {
                    // create the member if its a new name appearing 
                    $member = Member::firstOrCreate([
                        'user_id'               => auth()->id(),
                        'name'                  => $row[1],
                        'telephone'             => $newphone,
                        'amount_before'         => $newbefore,
                        'welfare_before'        => $newwelfare,
                        'welfareowed_before'    => abs($newwelfareowed),
                    ]);

                    // send notification
                    // $user = User::where('id', auth()->id())->first();
                    // Notification::send($user, new StoreMember($member));
                }
            } catch (Exception $e) {
                // throw $e;
                return $e->getMessage();
                return 'Array Formation Failed!!';
            }
        }

        // get members 
        $members = DB::table('members')->where('deleted_at', null)->orderBy('created_at', 'asc')->get();
        return $members;
    }

    // enter cycles and payments 
    public function paysArray($collection2, $collection, $year)
    {
        // get header
        $header = array();

        foreach ($collection2[0][0] as $key => $value) {
            // months 
            $month1     = strtoupper('January');
            $month2     = strtoupper('February');
            $month3     = strtoupper('March');
            $month4     = strtoupper('April');
            $month5     = strtoupper('May');
            $month6     = strtoupper('June');
            $month7     = strtoupper('July');
            $month8     = strtoupper('August');
            $month9     = strtoupper('September');
            $month10    = strtoupper('October');
            $month11    = strtoupper('November');
            $month12    = strtoupper('December');

            // welfare
            $welfIn     = 'Total Welfare';
            $welfOut    = 'Welfare Owing';

            // months conditional
            if ($value == $month1 || $value == $month2 || $value == $month3 || $value == $month4 || $value == $month5 || $value == $month6 || $value == $month7 || $value == $month8 || $value == $month9 || $value == $month10 || $value == $month11 || $value == $month12) {
                // array
                $rec = array('cycle_name' => $value, 'row' => $key);
                array_push($header, $rec);

                // get dates 
                $name       = $value . ' ' . $year;

                // $date       = Carbon::now()->format('d/m/Y');
                $date       = Carbon::parse($value)->setYear($year)->firstOfMonth()->addDays(1);

                $exist      = $this->cycleColExists($name, $value, $year);
                
                // request to update setting
                $setting    = Setting::orderBy('created_at', 'desc')->first();  
                
                // create pays array 
                $pays       = $this->showPays($key, $collection);
                // return $pays;

                // minimum payment number 
                $minimum    = $pays->count() - 1;
                
                if ($exist) {
                    $cycle = Cycle::where('name', $name)
                                ->where('month', $value)
                                ->where('year', $year)
                                ->first();

                    // foreach excel row 
                    foreach ($pays as $row) {
                        $member = Member::where('name', $row[1])->first();

                        if (Payment::where([['payment', $row[$key]], ['cycle_id', $cycle->id]])->exists()) {
                            
                            return true;
                            if (strval($member?->name) == $row[1]) {
                                Payment::where('member_id', $member->id)
                                    ->where('cycle_id', $cycle->id)
                                    ->update([
                                        'payment'       => $row[$key],
                                    ]);
                            }
                        } else {
                            return false;
                            if (strval($member?->name) == $row[1]) {
                                Payment::firstOrCreate([
                                    'user_id'       => auth()->id(),
                                    'cycle_id'      => $cycle->id,
                                    'member_id'     => $member->id,
                                    'payment'       => $row[$key],
                                ]);
                            }
                        }
                    }
                } else {
                    if ($minimum > 0) {
                        $cycle      = Cycle::firstOrCreate([
                            'user_id'       => auth()->id(),
                            'name'          => $name,
                            'date'          => $date,
                            'month'         => $value,
                            'year'          => $year,
                            'amount'        => $setting->payment_def,
                            'welfare_amnt'  => $setting->welfare_def,
                            'members_no'    => '1',
                            'total'         => '1',
                        ]);

                        // enter each payment 
                        foreach ($pays as $row) {
                            // if there is a match create array else create new member and update
                            $member = Member::where('name', $row[1])->first();
                            
                            // return $member;
                            if (strval($member?->name) == $row[1]) {
                                Payment::firstOrCreate([
                                    'user_id'       => auth()->id(),
                                    'cycle_id'      => $cycle->id,
                                    'member_id'     => $member->id,
                                    'payment'       => $row[$key],
                                ]);
                            }
                        }
                    }  
                }
                // return $cycle;

                // check if payments exists if not delete the cycle
                $this->showPayExists($cycle);
            }

            // // welfare conditional 
            // if ($value == $welfIn) {

            //     // create wels array 
            //     $wels    = $this->showPays($key, $collection);

            //     // foreach excel row 
            //     foreach ($wels as $row) {
            //         foreach ($members as $member) {
            //             // get latest cycle 
            //             $latest = DB::table('cycles')->where('deleted_at', null)->orderBy('created_at', 'desc')->first();

            //             // if there is a match create array else create new member and update
            //             if ($member->name == $row[1]) {
            //                 Member::where('id', $member->id)
            //                     ->update([
            //                         'welfare_before'          => abs($row[17])
            //                     ]);

            //                 // Welfare::create([
            //                 //     'user_id'       => auth()->id(),
            //                 //     'cycle_id'      => $latest->id,
            //                 //     'member_id'     => $member->id,
            //                 //     'payment'       => $row[17],
            //                 //     'type'          => 1
            //                 // ]);
            //             }
            //         }
            //     }
            // }

            // // welfare owed conditional 
            // if ($value == $welfOut) {

            //     // create wels array 
            //     $wels    = $this->showPays($key, $collection);

            //     // foreach excel row 
            //     foreach ($wels as $row) {
            //         foreach ($members as $member) {
            //             // get latest cycle 
            //             $latest = DB::table('cycles')->where('deleted_at', null)->orderBy('created_at', 'desc')->first();

            //             // if there is a match create array else create new member and update
            //             if ($member->name == $row[1]) {
            //                 Member::where('id', $member->id)    
            //                         ->update([
            //                             'welfareowed_before'          => abs($row[18])
            //                         ]);

            //                 // Welfare::create([
            //                 //     'user_id'       => auth()->id(),
            //                 //     'cycle_id'      => $latest->id,
            //                 //     'member_id'     => $member->id,
            //                 //     'payment'       => $row[18],
            //                 //     'type'          => 0
            //                 // ]);
            //             }
            //         }
            //     }
            // }
        } 

        // update cycles 
        $cycles = $this->updateCycles();

        // update finances 
        $finances = new FinancesController();
        $finances->update();

        // get cycles 
        return $cycles;
    }

    public function showCycles($value, $year) 
    {
        // get & update all cycles 
        $cycles      = Cycle::orderBy('id', 'desc')->get();

        // get dates 
        $name       = strtoupper($value . ' ' . $year);
        // $date       = Carbon::now()->format('d/m/Y');
        $date       = Carbon::parse($value)->setYear($year)->firstOfMonth()->addDays(1);

        // request to update setting
        $setting    = Setting::orderBy('created_at', 'desc')->first();

        foreach ($cycles as $cycle) {

            // if there is a match create array else create new cycle and update
            if ($cycle->name = $name) {

                // create or update the cycle if its a new name appearing 
                $cycle = Cycle::where('id', $cycle->id)->update([
                    'amount'        => $setting->payment_def,
                    'welfare_amnt'  => $setting->welfare_def,
                    'members_no'    => '1',
                    'total'         => '1',
                ]);

                return $cycle;
            } else {
                try {
                    // create the cycle if its a new name appearing 
                    $cycle = Cycle::create([
                        'user_id'       => auth()->id(),
                        'name'          => $name,
                        'date'          => $date,
                        'month'         => $value,
                        'year'          => $year,
                        'amount'        => $setting->payment_def,
                        'welfare_amnt'  => $setting->welfare_def,
                        'members_no'    => '1',
                        'total'         => '1',
                    ]);

                    // continue the array if needed
                    $rec2    = array('name' => $cycle->name, 'cycle_id' => $cycle->id);
                    array_push($OGcycles, $rec2);

                    return $cycle;
                } catch (\Exception $e) {
                    // throw $e;
                    return $e->getMessage();
                    return 'Array Formation Failed!!';
                }
            }
        }    
    }

    // get payments from columns 
    public function showPays($key, $collection)
    {
        $pays       = $collection[0]->where([$key, null]);

        return $pays;
    }

    // check if cycle exists 
    public function cycleColExists($name, $value, $year)
    {
        if (Cycle::where([['name', $name], ['month', $value], ['year', $year]])->exists()) {
            $exist = true;
        } else {
            $exist = false;
        }

        return $exist;
    }

    // check if member exists
    public function memberRowExists($id, $name)
    {
        if (Member::where([['name', $name], ['id', $id]])->exists()) {
            $exist = true;
        } else {
            $exist = false;
        }

        return $exist;
    }

    public function memberWelfarePays($new)
    {
        // get first cycle 
        $cycle = DB::table('cycles')->where('deleted_at', null)->orderBy('created_at', 'desc')->first();

        // foreach excel row 
        foreach ($new as $row) {
            if ($row[17] == null) {
                $welfare = '0';
            } else {
                $welfare = $row[17];
            }

            if ($row[18] == null) {
                $welfareowed = '0';
            } else {
                $welfareowed = intval($row[18]);
            }

            $newwelfare     = str_replace(',', '', $welfare);
            $newwelfareowed = str_replace(',', '', $welfareowed);

            try {

                if (Member::where([['name', $row[1]], ['id', $row[0]]])->exists()) {

                    $member = Member::where([['name', $row[1]], ['id', $row[0]]])->first();

                    if ($newwelfare != $member->welfare_before) {
                        $diff = abs($newwelfare) - $member->welfare_before;

                        // create the welfare owing if there is a diffrence in amounts 
                        if (strval($member?->welfare_before) != '0') {
                            Welfare::firstOrCreate([
                                'user_id'       => auth()->id(),
                                'cycle_id'      => $cycle->id,
                                'member_id'     => $member->id,
                                'payment'       => abs($diff),
                                'type'          => 1
                            ]);
                        }
                    }

                    if ($newwelfareowed != $member->welfareowed_before) {
                        $diff = abs($newwelfareowed) - $member->welfareowed_before;

                        // create the welfare owing if there is a diffrence in amounts 
                        if (strval($member?->welfareowed_before) != '0') {
                            Welfare::firstOrCreate([
                                'user_id'       => auth()->id(),
                                'cycle_id'      => $cycle->id,
                                'member_id'     => $member->id,
                                'payment'       => abs($diff),
                                'type'          => 0
                            ]);
                        }
                    }
                }

            } catch (Exception $e) {
                // throw $e;
                return $e->getMessage();
                return 'Array Formation Failed!!';
            }
        }

        // get members 
        $members = DB::table('members')->where('deleted_at', null)->orderBy('created_at', 'asc')->get();

        return $members;
    }
    
    // if payments uploaded are zero this will delete that empty cycle 
    public function showPayExists($cycle)
    {
        $pays       = Payment::where('cycle_id', $cycle->id)->count();

        if ($pays == 0) {
            $cycles = new CycleController();
            $cycles->destroy($cycle);
        }
    }

    public function updateCycles()
    {
        // get all cycles 
        $cycles = DB::table('cycles')->orderBy('created_at', 'desc')
            ->where('deleted_at', null)
            ->get();

        // update each cycle 
        foreach ($cycles as $cycle) {
            $cycle      = Cycle::where('id', $cycle->id)->first();
            $this->updateCycle($cycle);
        }

        // get all cycles 
        $cycles = DB::table('cycles')->orderBy('created_at', 'asc')
            ->where('deleted_at', null)
            ->get();

        // return the cycles 
        return $cycles;
    }

    public function updateCycle(Cycle $cycle)
    {
        $total      = $cycle->payments_total + $cycle->welfares_total;

        $payments   = Payment::where('cycle_id', $cycle->id)->count();

        $activeMembers = Member::where('active', 1)->count();

        if ($payments >= $activeMembers) {
            $done       = 1;
            $percent    = 100;
        } else {
            $done           = 0;
            $expected       = $activeMembers * $cycle->amount;
            $percent        = number_format(
                ($cycle->payments_total / $expected) * 100
            );
        }

        // update cycle
        Cycle::where('id', $cycle->id)
            ->update([
                'percent'       => $percent,
                'completed'     => $done,
                'members_no'    => $payments,
                'total'         => $total
            ]);
    }
}
