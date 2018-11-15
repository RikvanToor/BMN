<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCommentToAvailabilities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('availability', function (Blueprint $table) {
            $table->string('reason')->nullable();
            $table->dateTime('start')->nullable()->change();
            $table->dateTime('end')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('availability', function (Blueprint $table) {
            $table->dropColumn('reason');
            $table->dateTime('end')->nullable(false)->change();
            $table->dateTime('start')->nullable(false)->change();
        });
    }
}
