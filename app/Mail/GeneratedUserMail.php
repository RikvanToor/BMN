<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GeneratedUserMail extends Mailable {
    const MAIL_VIEW = 'emails.generateduser';
    const MAIL_SUBJECT = 'BMN account aangemaakt';
    use Queueable, SerializesModels;

    private $url = '';
    private $userName = '';
    private $name = '';

    public function __construct($url,$name, $userName){
        $this->url = $url;
        $this->name = $name;
        $this->userName = $userName;
    }

    public function build(){
        return $this->view(self::MAIL_VIEW)
            ->subject(self::MAIL_SUBJECT)
            ->with([
                'url' => $this->url,
                'name' => $this->name,
                'userName' => $this->userName
            ]);
    }
}