import React, { Component } from "react";
import { PageHeader } from 'react-bootstrap';

class BMNInfo extends Component {
  render() {
    return (
      <div className="info-style text-center">
        <PageHeader>Wat is de Bèta Music Night?</PageHeader>
        <div>
          <p>
            De Bèta Music Night (BMN) is een jaarlijks terugkerend concert georganiseerd door de gelijknamige commissie van studievereniging A–Eskwadraat. 
            De eerste editie was in 2013, en hierop volgden al zés edities. Ondertussen is de Bèta Music Night uitgegroeid tot één van de grootste activiteiten van A–Eskwadraat.
            We zijn alweer druk bezig met het organiseren van de zevende editie, en tevens het vijfjarige jubileum van de commissie.
          </p>
          <p>
            Voor de BMN worden de beste muzikanten van A–Eskwadraat bij elkaar gebracht. Ook dit jaar hebben we weer een groep van dertig muzikanten bij elkaar weten te vinden. 
            De setlist bestaat volledig uit covers van bekende en wat minder bekende nummers. De bezetting per nummer is steeds anders, zo staat er bij geen elk nummer precies
            dezelfde groep op het podium. Op deze manier leren de muzikanten samenspelen met veel verschillende mensen en doen hierbij heel nuttige bandervaring op. Het is ook 
            mooi om te zien dat wij als echte bèta-vereniging naast onze exacte kwaliteiten ook ons van een een andere kant kunnen laten zien. 
          </p>
          <p>
            De zevende editie van de BMN vindt plaats op 5 juni 2019 in de Helling, Utrecht. Houdt onze <a href="">Facebookpagina</a> goed in de gaten voor de laatste nieuwtjes.
          </p>
        </div>
      </div>
    );  
  }
}

export default BMNInfo;