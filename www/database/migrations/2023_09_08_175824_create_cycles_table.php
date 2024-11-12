<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('cycles', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');
            $table->string('name')->unique();
            $table->string('date');
            $table->string('month');
            $table->string('year');
            $table->integer('amount')->default(0);
            $table->integer('welfare_amnt')->default(0);
            $table->integer('members_no')->default(0);
            $table->integer('total')->default(0);
            $table->integer('percent')->default(0);
            $table->boolean('completed')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cycles');
    }
};
