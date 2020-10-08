import React, { Component } from "react";
import { PageHeader, Grid, Col, Button } from 'react-bootstrap';

class BMNInfo extends Component {
  render() {
    return (
      <Grid id="info" className="text-center">
        <PageHeader>Wat is de Bèta Music Night?</PageHeader>
        <Col sm={10} xs={12} className="col-sm-offset-1">
          <p>
            De Bèta Music Night (BMN) is een jaarlijks terugkerend concert, georganiseerd door de gelijknamige commissie van studievereniging A–Eskwadraat.
            De eerste editie was in 2013, en hierop volgden al acht edities. Ondertussen is de Bèta Music Night uitgegroeid tot één van de grootste activiteiten van A–Eskwadraat.
            We zijn alweer druk bezig met het organiseren van de negende editie.
          </p>
          <p>
            Voor de BMN worden de beste muzikanten van A–Eskwadraat bij elkaar gebracht. Ook dit jaar gaan we weer een groep van ongeveer dertig muzikanten bij elkaar te vinden.
            De setlist bestaat volledig uit covers van bekende en wat minder bekende nummers. De bezetting per nummer is steeds anders, zo staat er bij geen enkele twee nummers precies
            dezelfde groep op het podium. Op deze manier leren de muzikanten samenspelen met veel verschillende mensen en doen hierbij heel nuttige bandervaring op. Het is ook
            mooi om te zien dat wij als echte bèta-vereniging naast onze exacte kwaliteiten ons ook van een een andere kant kunnen laten zien.
          </p>
          {/* <p>
            De zevende editie van de BMN vindt plaats op 5 juni 2019 in de Helling, Utrecht.
            De deuren zullen om 19:30 openen, en om 20:00 begint het concert.
            Houd onze <a href="https://www.facebook.com/BetaMusicNight/" target="_blank">Facebookpagina</a> goed in de gaten voor de laatste nieuwtjes.
          </p>
          <p>
            Tickets zijn nu beschikbaar via de website van A-Eskwadraat!
          </p>
          <p>
            <a href="https://www.a-eskwadraat.nl/Activiteiten/bmn/7693/BtaMusicNight2019/KaartjeKopen?cleanhtml=1">
              <Button bsStyle="primary" bsSize="lg">Tickets</Button>
            </a>
          </p> */}
        </Col>
      </Grid>
    );
  }
}

export default BMNInfo;