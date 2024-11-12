<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('finances', function (Blueprint $table) {
            $table->id();
            // user 
            $table->string('user_id');
            // defaults 
            $table->integer('payment_def')->default(0);
            $table->integer('welfare_def')->default(0);
            // members 
            $table->integer('members_no')->default(0);
            // cycles 
            $table->integer('cycles_no')->default(0);
            // payments 
            $table->integer('total_pays')->default(0);
            // projects expenses 
            $table->integer('projects_no')->default(0);
            $table->integer('projects_comp')->default(0);
            $table->integer('total_expenses')->default(0);
            // welfares 
            $table->integer('welfare_in')->default(0);
            $table->integer('welfare_out')->default(0);
            $table->integer('total_welfare')->default(0);
            // totals 
            $table->integer('money_left')->default(0);
            $table->integer('money_out')->default(0);
            $table->integer('all_money')->default(0);
            // percent 
            $table->integer('percent')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};
