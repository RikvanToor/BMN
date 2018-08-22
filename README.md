# BMN
Rewrite voor de BMN website. De backend wordt geschreven in PHP met [Lumen](https://lumen.laravel.com/docs/5.6). De frontend zien we later wel.

# Lokaal runnen

Prerequisites:

* PHP
* MySQL
* Composer

PHP en MySQL zijn op Windows het makkelijkst te verkrijgen via [XAMPP](https://www.apachefriends.org/download.html). Zorg dat je `PATH` environment variable zowel `C:\XAMPP\PHP` als `C:\XAMPP\MySQL\bin` bevat. Op Linux zijn alle packages makkelijker te verkrijgen via de package manager van je distributie.

Okay, tijd voor het

## Stappenplan

1. Open een terminal en typ `mysql -u root -p`. Druk op enter. 
2. Als je ingelogd bent, run dan `CREATE USER 'bmn'@'localhost' IDENTIFIED BY 'password';`.
3. Run vervolgens `GRANT ALL PRIVILEGES ON bmn.* TO 'bmn'@'localhost';`.
4. Typ `\q` en druk op enter. Log vervolgens weer in met het nieuwe account: `mysql -u bmn -p`.
5. Doe `CREATE DATABASE bmn;` en ga weer weg met `\q`.
6. Clone deze repository ergens: `git clone git@github.com:RikvanToor/BMN.git`.
7. Navigeer in je terminal naar de map die net aangemaakt is. Waarschijnlijk kan dit gewoon met `cd BMN`.
8. Maak een bestand genaamd `.env` aan in de BMN map. Stop daar dit in:
    ```
    APP_ENV=local
    APP_DEBUG=true
    APP_KEY=
    APP_TIMEZONE=UTC
    
    LOG_CHANNEL=stack
    LOG_SLACK_WEBHOOK_URL=
    
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=bmn
    DB_USERNAME=bmn
    DB_PASSWORD=password
    
    CACHE_DRIVER=array
    SESSION_DRIVER=array
    QUEUE_DRIVER=sync
    ```
    Sla het bestand op.
8. Doe `php artisan jwt:secret` in je terminal.
9. Als je composer al hebt geïnstalleerd, ga dan naar b. Zo niet, doe dan a.
    a. Zit je op Linux? Installeer dan gewoon composer zoals je dat met iedere andere package zou doen. Fixed. Ga naar b. Gebruik je Windows? Volg dan [dit](https://getcomposer.org/download/) óf download PHPStorm en open de map van dit project in het programma. Druk dan bovenin op `Tools > Composer > Init Composer`. Er wordt nu een bestand genaamd `composer.phar` in je projectmap neergezet. Iedere keer dat je vanaf nu een commando wat begint met `composer` moet uitvoeren, moet jij in plaats daarvan `php composer.phar` doen. Ja? Oke, ga door naar b.
    b. Run `composer install`. Alle Lumen dependencies worden nu geïnstalleerd.
10. Run `php artisan migrate`. De database wordt nu aangemaakt.
10. Run `php artisan db:seed`. Er worden nu voorbeeld rijen in de 
    databasetabellen toegevoegd.
11. Run `php -S localhost:8080 -t public`. Als je nu in je browser naar `localhost:8080` gaat, krijg je de indexpagina te zien. Lekker.

# Bijdragen

Maak issues aan voor alles wat je wil doen, ook voor dingen die je het niet zelf gaat doen. Wil je een issue oplossen? Vraag me dan even of ik je kan toevoegen aan de repo. Assign jezelf op een issue, pull de master, maak een nieuwe branch aan, ontwikkel je ding en stuur een pull request. NOOIT DIRECT NAAR DE MASTER PUSHEN!
