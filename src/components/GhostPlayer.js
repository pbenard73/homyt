import React, {  useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';

const CasperVideo = styled.video`
    display:none;
`

const GhostPlayer = () => {
  const audioUrl = useSelector(state => state.app.audioUrl)
  const mpdState = useSelector(state => state.app.mpdStatus?.state)

  const memoizedVideo = useMemo(() => audioUrl && mpdState === 'play' && (
    <>
    <CasperVideo
      controls 
      id="casper_video"
      crossOrigin="anonymous"
      autoplay
      >
      <source src={audioUrl}/>       
    </CasperVideo>
    <script>
      document.getElementById('casper_video').play()
    </script>
        </>

  ), [audioUrl, mpdState])

  return memoizedVideo
}

export default GhostPlayer;
