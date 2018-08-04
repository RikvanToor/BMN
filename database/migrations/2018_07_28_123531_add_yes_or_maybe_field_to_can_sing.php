<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddYesOrMaybeFieldToCanSing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('can_sing', function (Blueprint $table) {
            $table->string('yes_or_maybe');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('can_sing', function (Blueprint $table) {
            $table->dropColumn('yes_or_maybe');
        });
    }
}
