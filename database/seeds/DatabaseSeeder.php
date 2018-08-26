<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\News;
use App\Models\Rehearsal;
use App\Models\Song;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * Create three users:
         * - Admin
         * - User1
         * - User2
         */
        $admin = User::create([
            'username' => 'admin',
            'password' => app('hash')->make('password'),
            'name' => 'Administrator',
            'email' => 'bmn@a-es2.nl',
            'is_active' => true,
            'is_admin' => true
        ]);

        $user1 = User::create([
            'username' => 'user1',
            'password' => app('hash')->make('password'),
            'name' => 'User1',
            'email' => 'user1@gmail.com',
            'is_active' => true,
            'is_admin' => false
        ]);

        $user2 = User::create([
            'username' => 'user2',
            'password' => app('hash')->make('password'),
            'name' => 'User2',
            'email' => 'user2@gmail.com',
            'is_active' => true,
            'is_admin' => false
        ]);

        /*
         * Create an example song.
         */
        $song = Song::create([
            'title' => 'Song',
            'artist' => 'Artist',
            'spotify_link' => 'n/a',
            'comment' => 'Test song',
            'genre' => 'Test genre',
            'vocals' => 'm/v',
            'backing' => 1,
            'duet' => false,
        ]);

        /*
         * Make user1 and user2 play guitar and drums on the example song.
         */
        $song->players()->sync([
            $user1->id => ['instrument' => 'Guitar'],
            $user2->id => ['instrument' => 'Drums']
        ]);

        /*
         * Create an example rehearsal.
         */
        $rehearsal1= Rehearsal::create([
            'location' => 'Rehearsal room',
            'start' => date_create('2018-12-01 18:00:00'),
            'end' => date_create('2018-12-01 21:00:00')
        ]);

        /*
         * Rehearse the example song from 6 to 7 during the rehearsal.
         */
        $rehearsal1->songs()->sync([
            $song->id => [
                'start' => date_create('2018-12-01 18:00:00'),
                'end' => date_create('2018-12-01 19:00:00')
            ]
        ]);

        /*
         * Add some example availabilities.
         */
        $example_availability = [
            'start' => date_create('2018-07-01 18:00:00'),
            'end' => date_create('2018-07-01 21:00:00')
        ];

        $rehearsal1->availabilities()->sync([
            $admin->id => $example_availability,
            $user1->id => $example_availability,
            $user2->id =>$example_availability
        ]);

        /*
         * Create an example news article.
         */
        News::create([
            'user_id' => $admin->id,
            'title' => 'An example title',
            'content' => "## Some content\n\nThis content includes markdown.\n\n* Item 1\n* Item 2"
        ]);
    }
}
