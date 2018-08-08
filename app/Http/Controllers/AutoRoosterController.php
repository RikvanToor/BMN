<?php

namespace App\Http\Controllers;

//use App\Rooster\AutoRoosterTest;
use App\Models\Song;
use App\Models\User;

class AutoRoosterController extends Controller
{
	/**
	 * Generate rooster with 20 minutes for each song because implementing different timings is difficult for now. Returns string with printed result.
	 */
    public function GenerateRooster($songs, $starttime, $endtime, $numberOfStages) {
		$timedSongs = array();
		for($i = 0; $i < count($songs); $i++) {
			$timedSongs[$i] = new TimedSong($songs[$i], 20);
		}

		return AutoRooster::MaakRooster($timedSongs, $starttime, $endtime, $numberOfStages);
        //$art = new AutoRoosterTest();
        //$art->Test();
    }
}

//250 regels code die maar 2x per jaar gebruikt worden :P
/*class AutoRoosterTest{
	public static function Test() {
		$Niels = new Player();
		$Sander = new Player();
		$Diego = new Player();
		$Rik = new Player();
		$Franca = new Player();
		$Roos = new Player();
		$Jonne = new Player();
		$Lotte = new Player();
		$Gerwout = new Player();
		
		$song1 = new TimedSong("Barracuda", array($Niels, $Sander, $Diego), 15);
		$song2 = new TimedSong("CarryOnWaywardSon", array($Niels, $Rik, $Franca, $Roos), 35);
		$song3 = new TimedSong("Toxicity", array($Jonne, $Lotte, $Diego), 25);
		$song4 = new TimedSong("ColdBlood", array($Diego, $Rik, $Lotte), 20);
		$song5 = new TimedSong("GayBar", array($Sander, $Diego, $Franca), 15);
		$song6 = new TimedSong("Muzak", array($Franca, $Sander, $Rik), 20);
		$song7 = new TimedSong("Ding1", array($Sander, $Niels, $Roos), 20);
		$song8 = new TimedSong("Ding2", array($Jonne, $Roos, $Rik), 20);
		$song9 = new TimedSong("Ding3", array($Niels, $Franca, $Roos), 20);
		$song10 = new TimedSong("GerwoutSong", array($Gerwout), 20);
        
		$nummers = [$song1, $song2, $song3, $song4, $song5, $song6, $song7, $song8, $song9, $song10];

		AutoRooster::MaakRooster($nummers, 1050, 1300, 2);
	}
}

class Player {
	public $name = "Piet";
	
	public function __construct() {
	}
}*/

class TimedSong {
	//public $players;
	//public $name;
	public $song;
	public $time;
	
	//public function __construct($name, $players, $time) {
	//	$this->name = $name;
	//	$this->players = $players;
	//	$this->time = $time;
	//}
	public function __construct($song, $time) {
		$this->song = $song;
		$this->time = $time;
	}
	
	public function players() {
		return $this->song->players();
	}
}


class AutoRooster {
	// Maakt een rooster voor een bepaald $aantalOefenruimtes. $nummers is een array van 'timedsong's
	// $start en $eind zijn resp. de begin- en eindtijd van de repetitie, in minuten sinds middernacht (!!) - dus bijv: 17:30 wordt 17*60 + 30 = 1050.
	public static function MaakRooster($nummers, $start, $eind, $aantalOefenruimtes)
		{
			$duur = $eind - $start;
			
			$roosters = array(); //array van roosters
			$roostersNum = 0;

			//Probeer maximaal 1000 keer een rooster te maken dat beter werkt (alles inplant)
			for ($try = 0; $try < 1000; $try++)
			{
                $inteplannennummers = array();
                for($i = 0; $i < count($nummers); $i++) {
                    $inteplannennummers[$i] = clone $nummers[$i];
                }

				$inteplannennummersNum = 0;
				
                $rooster = array(array()); //grootte: duur, aantalOefenruimtes. array van nummers: één nummer voor elke minuut in elke oefenruimte.
                for ($i = 0; $i < $duur; $i++) {
                    for ($j = 0; $j < $aantalOefenruimtes; $j++) {
                        $rooster[$i][$j] = null;
                    }
                }


				//Maak een rooster
				for ($minuut = 0; $minuut < $duur; $minuut++)
				{
					for ($ruimte = 0; $ruimte < $aantalOefenruimtes; $ruimte++)
					{
						if ($rooster[$minuut][$ruimte] == null)
						{
							if (count($inteplannennummers) == 0) break;

							//Als er nog geen nummer ingepland staat op deze minuut vult ie een random nummer in die geen overlap heeft met bestaande nummers in andere oefenruimtes
							$nummer = NULL;

							//Randomize lijst inteplannennummers
							shuffle($inteplannennummers);

							//Ga alle nog in te plannen nummers af
							foreach ($inteplannennummers as $i) {
								$nummer = clone $i;
                                $overlap = false;
                                
                                //Check of er overlap is in de muzikanten van dit nummer en al ingeplande nummers op dezelfde tijd
								for ($j = 0; $j < $aantalOefenruimtes; $j++)
								{
									if ($rooster[$minuut][$j] != null) $overlap = self::HeeftOverlappendeMuzikanten($nummer, $rooster[$minuut][$j]);
									if ($overlap) break;
								}

								//Als er geen overlap is kiezen we dit nummer!
								if (!$overlap) break;
								else $nummer = NULL;
							}
							
							if ($nummer != NULL)
							{
								//Zet het gekozen nummer in de planning
                                //$inteplannennummers[$i] = NULL;
                                $nummerPos = 0;
                                for($i = 0; $i < count($inteplannennummers); $i++) {
                                    if($inteplannennummers[$i] == $nummer) {
                                        $nummerPos = $i;
                                        break;
                                    }
                                }

								unset($inteplannennummers[$nummerPos]);
								for ($k = $minuut; $k < $minuut + $nummer->time; $k++)
								{
									if ($k >= $duur) break;
									$rooster[$k][$ruimte] = $nummer;
								}
							}
						}
					}
				}
				
				$r = new Rooster($rooster, count($nummers) - count($inteplannennummers), $inteplannennummers);
				$roosters[$roostersNum] = $r;
				$roostersNum++;

				if ($r->aantalNummersIngepland == count($nummers) && $r->verschilInTijdsduur < 1) break;
			}

			//Vind het beste rooster
			$besteRooster = $roosters[0];
			foreach ($roosters as $r)
			{
				if ($r->aantalNummersIngepland > $besteRooster->aantalNummersIngepland) $besteRooster = $r;
				else if ($r->aantalNummersIngepland == $besteRooster->aantalNummersIngepland && $r->verschilInTijdsduur < $besteRooster->verschilInTijdsduur) $besteRooster = $r;
			}
			
			//Output
			$outputString = "";
			for ($i = 0; $i < $aantalOefenruimtes; $i++) 
			{
				$outputString .= "   --- Oefenruimte " . ($i + 1) . " ---</br>";
                $nummer = NULL;
				for ($j = 0; $j < $duur; $j++)
				{
					if ($besteRooster->nummers[$j][$i] != $nummer) 
					{
						$nummer = $besteRooster->nummers[$j][$i];
                        //$tijdString = gmdate("H:i", $begintijd + $j);
                        $tijdString = $start + $j;
						
						if ($nummer != null) { $outputString .= "    " . $tijdString . " - " . $nummer->song->fillable[0] . "</br>"; }
					}
				}
				
				$outputString .= "</br>";
			}

			if (count($besteRooster->nietIngepland) == 0) { $outputString .= "Alle nummers konden worden ingepland.</br>"; }
			else
			{
				$outputString .= "De volgende nummers konden niet ingepland worden:</br>";
				foreach ($besteRooster->nietIngepland as $n)
				{
					$outputString .= "- " . $n->name . "</br>";
				}
			}

			return outputString;
		}
	
	//Kijkt of er overlap zit in de muzikanten van twee nummers en output dit als een bool
	private static function HeeftOverlappendeMuzikanten($nummer1, $nummer2) {
		$muzikanten1 = $nummer1->players();
        $muzikanten2 = $nummer2->players();
		
		foreach($muzikanten1 as $muzikant) {
			if(in_array($muzikant, $muzikanten2, true)) return true;
		}
		
		return false;
	}
}

class Rooster {
	public $nummers = array(array());
	public $aantalNummersIngepland;
	public $verschilInTijdsduur = 0;
	public $nietIngepland = array();
	
	public function __construct($nummers, $aantalNummersIngepland, $nietIngepland) {
		$this->nummers = $nummers;
		$this->aantalNummersIngepland = (integer)$aantalNummersIngepland;
		$this->nietIngepland = $nietIngepland;
        
        $aantalOefenruimtes = count($nummers[0]);
        $duur = count($nummers);
		//Reken uit hoe lang elke ruimte bezet is
        $tijdsduren = array_fill(0, $aantalOefenruimtes, null);

		for ($i = 0; $i < $aantalOefenruimtes; $i++)
		{
			for ($j = 0; $j < $duur; $j++)
			{
				if ($nummers[$j][$i] != null) $tijdsduren[$i]++;
			}
		}
	
		//Reken het gemiddelde verschil uit in de tijdsduren die de ruimtes bezet zijn
		foreach ($tijdsduren as $i)
		{
			foreach ($tijdsduren as $j)
			{
				$this->verschilInTijdsduur += ((float)abs($i - $j)) / (count($tijdsduren) * count($tijdsduren));
			}
		}
	}
}
