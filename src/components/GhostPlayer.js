import React, {  useMemo } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';
import player from '../utils/player';

const CasperVideo = styled.video`
    display:none;
`

const GhostPlayer = () => {
  const audioUrl = useSelector(state => state.app.audioUrl)
  const mpdState = useSelector(state => state.app.mpdStatus?.state)

  useEffect(() => {
    const casperVideo = document.getElementById('casper_video');

    if (mpdState === 'play') {
      if (audioUrl) {
        casperVideo.src = audioUrl;
        casperVideo.play()
        player.setState('play')
      } else {
        casperVideo.src = null;
        casperVideo.pause();
        player.setState('pause')
      }
    } else {
      casperVideo.pause();
      player.setState('pause')
    }
  }, [audioUrl, mpdState])

  const memoizedVideo = useMemo(() => (
    <CasperVideo
      controls 
      id="casper_video"
      onPlay={(...args) => listener.dispatch(EVENTS.PLAYER_START, ...args)} 
      onPause={(...args) => listener.dispatch(EVENTS.PLAYER_PAUSE, ...args)} 
      onEnded={(...args) => listener.dispatch(EVENTS.PLAYER_END, ...args)}
      onTimeUpdate={(...args) => listener.dispatch(EVENTS.PLAYER_TIME_UPDATE, ...args)}
      onLoadedMetadata={(...args) => {
        document.getElementById('casper_video').play()
        listener.dispatch(EVENTS.PLAYER_META, ...args)
      }}
      crossOrigin="anonymous"
      autoplay
      >
      <source src={audioUrl}/>       
    </CasperVideo>
  ), [])

  return memoizedVideo
}

export default GhostPlayer;
