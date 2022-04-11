import { SatelliteAlt } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useApp } from '../redux/appSlice'
import { useVisualizer } from '../redux/visualizerSlice'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import listener, { EVENTS } from '../utils/listener';

const Radio = () => {
    const app = useApp()
    const radios = useSelector(state => state.app.radios);

    const playAction = songIndex => listener.dispatch(EVENTS.ACTION_PLAY_SONG, {index:0, radio:true, ...radios[songIndex]})

    return (
    <>
    <List>
        <button onClick={playAction}>RADIO</button>
        {radios.map((radio, songIndex) => (
            <ListItem key={radio.path}>
                <ListItemText primary={radio.name}  style={{color: 'white'}}/>
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
export default Radio