# BMN
Rewrite voor de BMN website. De backend wordt geschreven in PHP met [Lumen](https://lumen.laravel.com/docs/5.6). De frontend zien we later wel.

# Lokaal runnen

Prerequisites:

* PHP
* MySQL
* Composer
* NPM

PHP en MySQL zijn op Windows het makkelijkst te verkrijgen via [XAMPP](https://www.apachefriends.org/download.html). Zorg dat je `PATH` environment variable zowel `C:\XAMPP\PHP` als `C:\XAMPP\MySQL\bin` bevat. NPM krijg je het makkelijkst door [NodeJS](https://nodejs.org/en/download/) te installeren. Op Linux zijn alle packages makkelijker te verkrijgen via de package manager van je distributie.

Okay, tijd voor het

## Stappenplan

1. Open een terminal en typ `mysql -u root -p`. Druk op enter. 
2. Als je ingelogd bent, run dan `CREATE USER 'bmn'@'localhost' IDENTIFIED BY 'password';`.
3. Run vervolgens `GRANT ALL PRIVILEGES ON bmn.* TO 'bmn'@'localhost';`.
4. Typ `\q` en druk op enter. Log vervolgens weer in met het nieuwe account: `mysql -u bmn -p`.
5. Doe `CREATE DATABASE bmn;` en ga weer weg met `\q`.
6. Clone deze repository ergens: `git clone git@github.com:RikvanToor/BMN.git`.
7. Navigeer in je terminal naar de map die net aangemaakt is. Waarschijnlijk kan dit gewoon met `cd BMN`.
8. Als je composer al hebt geïnstalleerd, ga dan naar b. Zo niet, doe dan a.

    a. Zit je op Linux? Installeer dan gewoon composer zoals je dat met iedere andere package zou doen. Fixed. Ga naar b. Gebruik   je Windows? Volg dan [dit](https://getcomposer.org/download/) óf download PHPStorm en open de map van dit project in het programma. Druk dan bovenin op `Tools > Composer > Init Composer`. Er wordt nu een bestand genaamd `composer.phar` in je projectmap neergezet. Iedere keer dat je vanaf nu een commando wat begint met `composer` moet uitvoeren, moet jij in plaats daarvan `php composer.phar` doen. Ja? Oke, ga door naar b.
    
    b. Run `composer install`. Alle Lumen dependencies worden nu geïnstalleerd.
9. Kopieer het bestand `.env.example` in de BMN map en noem het `.env`. Pas de dingen tussen <> aan:
* JWT_SECRET: plak hier een secret. Deze kun je genereren met `php artisan jwt:secret`
* MAIL_*: vul hier gegevens in van een dummy mailserver. Het makkelijkst is een `mailtrap.io` account aan te maken op hun website en die instellingen te gebruiken. Daar kun je
de verzonden e-mails van de applicaties bekijken zonder dat ze echt verstuurd worden. Of deel een account met de commissie!
10. Run `php artisan migrate`. De database wordt nu aangemaakt.
11. Run `php artisan db:seed`. Er worden nu voorbeeld rijen in de 
    databasetabellen toegevoegd.
12. Run `php -S localhost:8080 -t public`. 
13. Run `npm start`. Als je nu in je browser naar `localhost:9000` gaat, krijg je de indexpagina te zien. Lekker.
14. Nu heb je een PHP server en een javascript server draaien. Wil je alles liever via PHP doen? Doe dan `npm run publish` ipv `npm start` en ga naar `localhost:8080` in plaats van `localhost:9000`.

# Bijdragen

Maak issues aan voor alles wat je wil doen, ook voor dingen die je het niet zelf gaat doen. Wil je een issue oplossen? Vraag me dan even of ik je kan toevoegen aan de repo. Assign jezelf op een issue, pull de master, maak een nieuwe branch aan, ontwikkel je ding en stuur een pull request. NOOIT DIRECT NAAR DE MASTER PUSHEN!
