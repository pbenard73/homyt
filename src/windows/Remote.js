import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import listener, { EVENTS } from '../utils/listener';
import { getclients } from '../api'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const Remote = () => {
    const [clients, setClients] = useState([])

    const getClients = async () => {
        const serverClients = await getclients()

        setClients(serverClients)
    }

    useEffect(() => {
        getClients()
    }, [])

    const volumeUp = clientId => listener.dispatch(EVENTS.REMOTE_ACTION_VOLUME, {target: clientId, up: true})   
    const volumeDown = clientId => listener.dispatch(EVENTS.REMOTE_ACTION_VOLUME, {target: clientId, up: false}) 
    const playNext = clientId => listener.dispatch(EVENTS.REMOTE_ACTION_NEXT, {target: clientId})
    const playPrev = clientId => listener.dispatch(EVENTS.REMOTE_ACTION_PREV, {target: clientId})

    return (    
        <List className="nodrag">
            {clients.map(client => (
                <ListItem key={client.uuid}>
                    <ListItemText primary={ client.ip } />
                    <ListItemSecondaryAction>
                        <IconButton style={{color:'white'}} onClick={() => playPrev(client.uuid)}>
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton style={{color:'white'}} onClick={() => playNext(client.uuid)}>
                            <SkipNextIcon />
                        </IconButton>
                        <IconButton style={{color:'white'}} onClick={() => volumeDown(client.uuid)}>
                            <VolumeDownIcon />
                        </IconButton>
                        <IconButton style={{color:'white'}} onClick={() => volumeUp(client.uuid)}>
                            <VolumeUpIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    )
}
export default Remote