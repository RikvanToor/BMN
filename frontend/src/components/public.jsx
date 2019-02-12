import React, { Component } from "react";
import PublicNavigation from "@Components/PublicNavigation.jsx";
import Carousel from "@Components/carousel.jsx";
import BMNInfo from "@Components/BMNInfo.jsx";
import { Table, Tooltip, OverlayTrigger, Button, ButtonGroup, PageHeader } from 'react-bootstrap';

class Public extends Component {
  render() {
    return (
      <div>       
          <PublicNavigation/>
          <Carousel/>
          <BMNInfo/>  
      </div>
    );
  }
}

export default Public;
