<?php

namespace App\Mail;

use App\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetMyPasswordMail extends Mailable {
    const MAIL_VIEW = 'emails.passwordreset';
    const MAIL_SUBJECT = 'BMN account wachtwoord resetten';
    use Queueable, SerializesModels;

    private $url = '';
    private $userName = '';

    public function __construct($url, $userName){
        $this->url = $url;
        $this->userName = $userName;
    }

    public function build(){
        return $this->view(MAIL_VIEW)
            ->subject(MAIL_SUBJECT)
            ->with([
                'url' => $this->url,
                'user' => $this->userName
            ]);
    }
}