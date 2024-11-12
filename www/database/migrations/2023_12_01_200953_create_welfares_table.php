<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('welfares', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('member_id');
            $table->string('cycle_id');
            $table->integer('payment');
            $table->boolean('type')->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('welfares');
    }
};
