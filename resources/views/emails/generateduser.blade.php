<div>
    <p>Beste {{$name}}</p>
    <p>De BMN commissie heeft voor jou een account aangemaakt! Je gebruikersnaam is</p>
    <p style="font-weight:bold">{{$userName}}</p>
    <p>Je kunt via onderstaande link een wachtwoord opgeven, waarna je kunt inloggen via 
        <a href="{{route('login')}}">{{route('login')}}</a></p>
    <a href="{{$url}}">{{$url}}</a>
    <p>Groetjes,</p>
    <p>De BMN commissie</p>
</div>