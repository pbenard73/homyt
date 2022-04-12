import React from 'react';
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';

const CasperVideo = styled.video`
    display:none;
`

const GhostPlayer = () => (
  <CasperVideo
    controls 
    id="casper_video"
    onPlay={(...args) => listener.dispatch(EVENTS.PLAYER_START, ...args)} 
    onPause={(...args) => listener.dispatch(EVENTS.PLAYER_PAUSE, ...args)} 
    onEnded={(...args) => listener.dispatch(EVENTS.PLAYER_END, ...args)}
    onTimeUpdate={(...args) => listener.dispatch(EVENTS.PLAYER_TIME_UPDATE, ...args)}
    onLoadedMetadata={(...args) => listener.dispatch(EVENTS.PLAYER_META, ...args)}
    crossOrigin="anonymous"
    >
    <source />       
  </CasperVideo>
)

export default GhostPlayer;
