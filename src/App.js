import React from "react";
import styled from "styled-components";
import Main from "./containers/Main";
import GhostData from "./containers/GhostData";
import Vizualizer from "./components/Vizualizer";
import Player from "./components/Player";
import GhostPlayer from "./components/GhostPlayer";
import Human from "./components/Human";

import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

const App = () => (
  <>
    <GhostData />
    <GhostPlayer />
    <Vizualizer />
    <Main />
    <Player />
    <Human />
  </>
)

export default App;
