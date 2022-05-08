import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RADIO_PLAYLIST_NAME, useApp } from '../redux/appSlice'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import listener, { EVENTS } from '../utils/listener';
import { addradio } from '../api'
import Form from '../components/Form'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button';
import { mpdAddToPlaylist, mpdDeleteFromPlaylist, mpdListenRadio } from './../apis/mpdApi'

const Radio = () => {
    const { t } = useTranslation()
    const app = useApp()
    const playlists = useSelector(state => state.app.playlists)


    const [add, setAdd] = useState(false);
    const [newRadio, setNewRadio] = useState({name: '', path:''});

    const onSubmit = async e => {
        e.preventDefault()
        const {valid} = await mpdAddToPlaylist({}, {
            params: [
                RADIO_PLAYLIST_NAME,
                `${newRadio.path}#${newRadio.name}`
            ]
        })
        
        if (valid === true) {
            setAdd(false)
        }
    }

    const getInfo = radio => {
        const splits = radio.file.split('#')
        
        return {
            name: splits.reverse()[0],
            path: splits[0]
        }
    }

    const listenRadio = (radio, radioIndex) => async () => {
        await mpdListenRadio({}, {params: [RADIO_PLAYLIST_NAME, `${radioIndex}:${radioIndex + 1}`]})
    }

    const deleteRadio = radio => async () => {
        await mpdDeleteFromPlaylist({}, {params: [RADIO_PLAYLIST_NAME, radio.baseIndex]})
    }

    const radioPlaylist = (playlists || []).find(i => i.name === RADIO_PLAYLIST_NAME);
    const songs = [...(radioPlaylist?.songs || [])].map((radio, index) => ({
        ...radio,
        baseIndex: index
     }))

    songs.sort((a, b) => {
        let {name: aName} = getInfo(a) 
        let {name: bName} = getInfo(b)

        return aName.toLowerCase() < bName.toLowerCase() ? -1 : 1;
    })

    return (
    <div style={{padding:'10px'}}>
        <Button
            style={{marginRight:'20px'}}
            onClick={() => setAdd(!add)}
        >
        {t('add_radio')}
        </Button>
        {add && (
            <Form onSubmit={onSubmit} className="nodrag">
                <div>
                    <TextField label="Radio name" value={newRadio.name} onChange={e => setNewRadio({...newRadio, name: e.target.value})} />
                    <TextField label="Radio URL" value={newRadio.url} onChange={e => setNewRadio({...newRadio, path: e.target.value})} />
                    <div>
                        <Button type="submit" style={{marginTop:'20px'}}>
                        {t('add')}
                        </Button>
                    </div>
                </div>
            </Form>
        )}
        <List className="nodrag">
            {songs.map((radio, radioIndex) => {
                const info = getInfo(radio);

                return (
                    <ListItem key={info.path}>
                        <ListItemText primary={info.name}  style={{color: 'white'}}/>
                        <ListItemSecondaryAction>
                            <IconButton onClick={deleteRadio(radio)} style={{color:'white'}}>
                                <DeleteForeverIcon />
                            </IconButton>
                            <IconButton onClick={listenRadio(radio, radio.baseIndex)} style={{color:'white'}}>
                                <PlayArrowIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    
    </div>
)
    }
export default Radio