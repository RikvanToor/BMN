<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSetlistFieldsToSong extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('songs', function (Blueprint $table) {
            $table->boolean('is_setlist');
            $table->integer('setlist_order');
            $table->index('is_setlist');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('songs', function (Blueprint $table) {
            $table->dropIndex('songs_is_setlist_index');
            $table->dropColumn('is_setlist');
            $table->dropColumn('setlist_order');
        });
    }
}
