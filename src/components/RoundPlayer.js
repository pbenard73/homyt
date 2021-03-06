import React, {useEffect, useState} from 'react';
import { IconButton } from '@mui/material'
import { listen } from '../api'
import { mpdNext, mpdPause, mpdPlay, mpdPrevious, mpdVolumeDown, mpdVolumeUp } from '../apis/mpdApi'
import styled from 'styled-components'
import { useSelector } from 'react-redux';
import { useApp } from '../redux/appSlice';
import listener, { EVENTS } from '../utils/listener';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import player from '../utils/player';
import storage, { STORAGE } from '../utils/storage';

const RoundPlayerWrapper = styled.div`
  position:relative;
  width:250px;
  height:250px;
  border: 2px solid #5fd7e3;
  box-shadow: 0 0 10px #00c1f9, 0 0 10px cyan inset;
  display:flex;
  align-items:center;
  justify-content: center;
  color: #1faceb;
  background:conic-gradient(from 181deg, #1faceb ${props => props.percent}%, black ${props => props.percent}%);
  border-radius:50%;
  cursor:pointer;
  &, & * {
    outline:none;
  }

  > span{
    cursor:initial;
    position:absolute;
    inset:0;
    margin:10px;    
    border-radius:50%;
    background: radial-gradient(#fbfbfb,#00d1f5,#040426 100%,#ffffff00 100%);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    > div.center{
      align-items:center;
    }
    > span.volume{
      pointer-events:none;
      position:absolute;
      inset:0;  
      border-radius:50%;
      background: linear-gradient(180deg, #000000aa ${props => 100 - (props.volume * 100)}%, transparent ${props => 100 - (props.volume * 100)}%);
    }
  }
  > i{
    z-index:2;
  }
  > video {
    display:none;
  }
`

const RoundPlayer = () => {
  const [videoRef, setVideoRef] = useState(null)
  const app = useApp()
  const mpdMode = true; //useSelector(state => state.app.mpdMode)
  const mpdStatus = useSelector(state => state.app.mpdStatus)

  const PLAY_TYPE = {
    PLAY: 'play',
    PAUSE: 'pause',
    STOP: 'stop'
  }

  const [state, setState] = useState(PLAY_TYPE.STOP);
  const [metadata, setMetadata] = useState({});
  const [volume, setVolume] = useState(storage.get(STORAGE.VOLUME) ||??1);

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = `${h < 10 ? '0':''}${h}:`;
    var mDisplay = `${m < 10 ? '0':''}${m}:`
    var sDisplay = `${s < 10 ? '0':''}${s}`

    return hDisplay + mDisplay + sDisplay;
  }

  const play = songWithIndex => {
    app.setPlayIndex(songWithIndex.index)
    const source = document.querySelector('#casper_video')
    source.src = listen.url({url: songWithIndex.path, radio: songWithIndex.radio});
    listener.dispatch(EVENTS.PLAYLIST_INDEX, songWithIndex.index)

    source.load();
    source.play();
  }

  useEffect(() => {
    setVideoRef(document.querySelector('#casper_video'))
    document.querySelector('#casper_video').volume = volume
    
    listener.register('action_play_song', EVENTS.ACTION_PLAY_SONG, song => play(song))
    
    listener.register('remote_volume', EVENTS.REMOTE_VOLUME, data => {
      if (data.up === true) {
        return onVolumeUpClick()
      }

      onVolumeDownClick()
    })
    
    listener.register('player_start', EVENTS.PLAYER_START, () => {
      setState(PLAY_TYPE.PLAY);
    })
    
    listener.register('player_stop', EVENTS.PLAYER_PAUSE, () => {
      setState(PLAY_TYPE.STOP);
    })
    
    listener.register('player_pause', EVENTS.PLAYER_PAUSE, () => {
      setState(PLAY_TYPE.PAUSE);
    })
    
    listener.register('player_time_update', EVENTS.PLAYER_TIME_UPDATE, (...args) => {
      const video = document.querySelector('#casper_video')
        var currentTime = video.currentTime;
        const duration = video.duration;
        listener.dispatch(EVENTS.PLAYER_CURRENT_HUMAN, secondsToHms(video.currentTime))
        const progress = Math.floor((currentTime/video.duration) * 100);
        
        setMetadata(o => ({
          currentTime, duration, progress
        }))
    })
    
    listener.register('player_end', EVENTS.PLAYER_END, () => {
      const playlist = player.getPlaylist()
      const index = player.getPlaylistIndex()
      const newIndex = index + 1

      if (playlist.length - 1 >= newIndex) {
        app.setPlayIndex(newIndex)
        play({...playlist[newIndex], index: newIndex})
      } else {
        setState(PLAY_TYPE.STOP);
        listener.dispatch(EVENTS.PLAYLIST_INDEX, null)
        app.setPlayIndex(null)
        listener.dispatch(EVENTS.PLAYER_CURRENT_HUMAN, '')
      }
    })
  }, [])

  const {playlist, playIndex} = useSelector(state => ({
    playlist: state.app.playlist,
    playIndex: state.app.playIndex
  }))

  const loadZix = (givenIndex, givenleaf = false) => {
    app.setPlayIndex(givenIndex)
    listener.dispatch(EVENTS.PLAYLIST_INDEX, givenIndex);
    const source = document.querySelector('#casper_video')
    
    const leaf = givenleaf === true ? givenIndex : playlist[givenIndex]

    source.src = listen.url({url: leaf.path});

    videoRef.load();
    videoRef.play();
  }

  const onPreviousClick = () => {
    if (mpdMode) {
      return mpdPrevious()
    }
    if (playIndex > 0) {
      loadZix(playIndex - 1)
    }
  }

  const onNextClick = () => {
    if (mpdMode) {
      return mpdNext()
    }

    if (playIndex + 1 < playlist.length) {
      loadZix(playIndex + 1)
    }
  }

  const onPlayClick = () => {
    if (mpdMode) {
      return mpdPlay()
    }

    const playlistIndex = player.getPlaylistIndex()
    const playlist = player.getPlaylist();

    if (playlistIndex === null && playlist.length > 0) {
      play({...playlist[0], index:0})
    } else if (playlist.length > 0) {
      document.querySelector('#casper_video').play();
    }
  }

  const onPauseClick = () => {
    if (mpdMode) {
      return mpdPause()
    }
    document.querySelector('#casper_video').pause();
  }

  const onVolumeUpClick = () => {
    if (mpdMode) {
      return mpdVolumeUp()
    }
    const source = document.querySelector('#casper_video')
    const mvolume = source.volume + 0.1;

    if (mvolume <= 1) {
      source.volume = mvolume
      setVolume(mvolume)
      storage.set(STORAGE.VOLUME, mvolume)
    }
  }

  const onVolumeDownClick = () => {
    if (mpdMode) {
      return mpdVolumeDown()
    }
    const source = document.querySelector('#casper_video')
    const mvolume = source.volume - 0.1;

    if (volume >= 0) {
      source.volume = mvolume
      setVolume(mvolume)
      storage.set(STORAGE.VOLUME, mvolume)
    }
  }

  function getDirection(originX, originY, targetX, targetY) {
    var dx = originX - targetX;
    var dy = originY - targetY;

    var theta = Math.atan2(-dy, -dx);
    theta *= 180 / Math.PI;         
    if (theta < 0) theta += 360;    

    return theta;
  }

  const onSeekClick = e => {
    if (e.target.closest('span.inner') !== null ||??metadata.duration === undefined){
      return
    }

    let bbox_rect = document.getElementById("round_player").getBoundingClientRect()
    let layerX = e.clientX-bbox_rect.left
    let layerY = e.clientY-bbox_rect.top

    let angle = (getDirection(127,127, layerX, layerY ) - 90) % 360
    angle = angle < 0 ? 270 + (angle + 90) : angle

    const percent = angle * 100 / 360

    let seek = Math.floor(metadata.duration * percent / 100)
    const source = document.querySelector('#casper_video')

    if (source.fastSeek) {
      source.fastSeek(seek)
    } else {
      source.currentTime = seek
    }
  }

  const percent = mpdStatus?.time?.elapsed * 100 / mpdStatus?.time?.total

  return (
    <div className="player" style={{position:'fixed', bottom:'0', left:'0'}}>
      <figure id="video_player"> 
        <RoundPlayerWrapper id="round_player" volume={mpdMode === true ? (mpdStatus?.volume ||??0) / 100 : volume} percent={percent ||??0} onClick={onSeekClick}>
          <span className="inner">

          <span className="volume"></span>
            <div>
            <IconButton onClick={onVolumeUpClick}>
                <VolumeUpIcon style={{width:'2em', height:'2em', color:'white'}} />
              </IconButton> 
            </div>
            <div className="center">
              <IconButton onClick={onPreviousClick}>
                <SkipPreviousIcon style={{width:'2em', height:'2em', color:'white'}} />
              </IconButton>
              {(mpdMode === true && mpdStatus.state === 'play') ||??state === PLAY_TYPE.PLAY ? (
                <IconButton onClick={onPauseClick}><PauseIcon style={{width:'3em', height:'3em', color:'white'}}/></IconButton>
              ) : (
                <IconButton onClick={onPlayClick}><PlayArrowIcon style={{width:'3em', height:'3em', color:'white'}}/></IconButton>
              )}
              <IconButton onClick={onNextClick}>
                <SkipNextIcon style={{width:'2em', height:'2em', color:'white'}} />
              </IconButton>
            </div>
            <div>
            <IconButton onClick={onVolumeDownClick}>
                <VolumeDownIcon style={{width:'2em', height:'2em', color:'white'}} />
              </IconButton> 
            </div>
            
          </span>
          <i></i>
          </RoundPlayerWrapper>
      </figure>
    </div>
  );
}

export default RoundPlayer;
