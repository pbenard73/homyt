import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';

const CasperVideo = styled.video`
    display:none;
`

const GhostPlayer = () => {
  const audioUrl = useSelector(state => state.app.audioUrl)
  const mpdState = useSelector(state => state.app.mpdStatus?.state)
  
  useEffect(() => {
    if (mpdState === 'play') {
      const videoElement = document.getElementById('casper_video')
      if (videoElement) {
        const isVideoPlaying = videoElement => !!(videoElement.currentTime > 0 && !videoElement.paused && !videoElement.ended && videoElement.readyState > 2);
        if (!isVideoPlaying) {
          videoElement.play()
        }
      }
    }
  })

  const memoizedVideo = useMemo(() => audioUrl && mpdState === 'play' && (
    <CasperVideo
      controls 
      id="casper_video"
      onPlay={(...args) => listener.dispatch(EVENTS.PLAYER_START, ...args)} 
      onPause={(...args) => listener.dispatch(EVENTS.PLAYER_PAUSE, ...args)} 
      onEnded={(...args) => listener.dispatch(EVENTS.PLAYER_END, ...args)}
      onTimeUpdate={(...args) => listener.dispatch(EVENTS.PLAYER_TIME_UPDATE, ...args)}
      onLoadedMetadata={(...args) => listener.dispatch(EVENTS.PLAYER_META, ...args)}
      crossOrigin="anonymous"
      autoplay
      >
      <source src={audioUrl}/>       
    </CasperVideo>

  ), [audioUrl, mpdState])

  return memoizedVideo
}

export default GhostPlayer;
