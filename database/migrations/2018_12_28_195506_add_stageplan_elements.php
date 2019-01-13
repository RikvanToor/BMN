<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStageplanElements extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stageplans', function(Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->integer('year');
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('stageplan_elements', function(Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->string('type');
            $table->string('geometry');
            $table->integer('stageplan_id')->unsigned();
            $table->foreign('stageplan_id')->references('id')->on('stageplans');
        });

        Schema::create('stageplan_positions', function(Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->string('geometry');

            $table->integer('stageplan_id')->unsigned();
            $table->foreign('stageplan_id')->references('id')->on('stageplans');
        });

        Schema::create('stageplan_roles', function(Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->integer('stageplan_id')->unsigned();
            $table->foreign('stageplan_id')->references('id')->on('stageplans');
            
            $table->integer('stageposition_id')->unsigned()->nullable();
            $table->foreign('stageposition_id')->references('id')->on('stageplan_positions')->onDelete('set null');
        });
        //Create stage plan channels table
        Schema::create('stageplan_channels', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('number')->unsigned();
            $table->string('mic_desc')->nullable();
            $table->string('insert')->nullable();
            $table->integer('stageelement_id')->unsigned()->nullable();
            $table->foreign('stageelement_id')->references('id')->on('stageplan_elements')->onDelete('set null');

            $table->integer('stageplan_id')->unsigned();
            $table->foreign('stageplan_id')->references('id')->on('stageplans');
        });

        Schema::create('stage_role_to_element', function(Blueprint $table){
            $table->increments('id');
            $table->integer('stageelement_id')->unsigned();
            $table->foreign('stageelement_id')->references('id')->on('stageplan_elements')->onDelete('cascade');
            $table->integer('stagerole_id')->unsigned();
            $table->foreign('stagerole_id')->references('id')->on('stageplan_roles')->onDelete('cascade');
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
        Schema::dropIfExists('stage_role_to_element');
        Schema::dropIfExists('stageplan_channels');
        Schema::dropIfExists('stageplan_roles');
        Schema::dropIfExists('stageplan_positions');
        Schema::dropIfExists('stageplan_elements');
        Schema::dropIfExists('stageplans');
    }
}
