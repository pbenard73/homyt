import { SatelliteAlt } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useApp } from '../redux/appSlice'
import { useVisualizer } from '../redux/visualizerSlice'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import listener, { EVENTS } from '../utils/listener';

const Playlist = () => {
    const app = useApp()
    const {playlist, playIndex} = useSelector(state => ({
        playlist: state.app.playlist,
        playIndex: state.app.playIndex
      }))

    const playAction = songIndex => listener.dispatch(EVENTS.ACTION_PLAY_SONG, {...playlist[songIndex], index: songIndex})

    return (
    <>
    <List>
        {playlist.map((song, songIndex) => (
            <ListItem key={song.path}>
                <ListItemText primary={song.name}  style={{color: songIndex === playIndex ? 'red' : 'white'}}/>
                <ListItemSecondaryAction>
                    <IconButton onClick={() => playAction(songIndex) } style={{color:'white'}}>
                        <PlayArrowIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
    
    </>
)
    }
export default Playlist