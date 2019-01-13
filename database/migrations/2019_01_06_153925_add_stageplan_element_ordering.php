<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStageplanElementOrdering extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Save order as stringified list of id's.
        Schema::table('stageplans', function(Blueprint $table){
            $table->string('element_order')->nullable();
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
        Schema::table('stageplans', function(Blueprint $table){
            $table->dropColumn('element_order');
        });
    }
}
