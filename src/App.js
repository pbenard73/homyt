import React, { Suspense } from "react";
import styled from "styled-components";
import Main from "./containers/Main";
import GhostData from "./containers/GhostData";
import Vizualizer from "./components/Vizualizer";
import Player from "./components/Player";
import GhostPlayer from "./components/GhostPlayer";
import Human from "./components/Human";

import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

const AppStyled = styled.div`
  @media screen and (max-width:768px) {
    .react-draggable.window_container {
      height: 100vh !important;
      top:0px !important;
      left: 0px !important;
      width: 100vw !important;
      z-index:5;
    }
  }
`

const App = () => (
  <AppStyled>
    <GhostData />
    <GhostPlayer />
    <Suspense callback={"loading"}>
    <Vizualizer />
    <Main />
    <Player />
    </Suspense>
    <Human />
  </AppStyled>
)

export default App;
