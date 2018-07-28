<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateForeignKeyPlays extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plays', function (Blueprint $table) {
            Schema::dropIfExists('plays');
        });

        Schema::create('plays', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->integer('song_id')->unsigned();
            $table->string('instrument');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('song_id')->references('id')->on('songs');
            $table->timestamps();
        });
    }

    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('plays', function (Blueprint $table) {
            Schema::dropIfExists('plays');
        });
    }
}