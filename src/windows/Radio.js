import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RADIO_PLAYLIST_NAME, useApp } from '../redux/appSlice'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import listener, { EVENTS } from '../utils/listener';
import { addradio } from '../api'
import Form from '../components/Form'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button';
import { mpdListenRadio } from './../apis/mpdApi'

const Radio = () => {
    const { t } = useTranslation()
    const app = useApp()
    const playlists = useSelector(state => state.app.playlists)

    const radioPlaylist = (playlists || []).find(i => i.name === RADIO_PLAYLIST_NAME);

    const [add, setAdd] = useState(false);
    const [newRadio, setNewRadio] = useState({name: '', path:''});

    const onSubmit = async e => {
        e.preventDefault()
        const {valid, files, radios} = await addradio({}, newRadio)

        if (valid !== false) {
            app.setRadios(radios)
            app.setFullTree(files)
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
        console.log('coucou radio')
        await mpdListenRadio({}, {params: [RADIO_PLAYLIST_NAME, `${radioIndex}:${radioIndex + 1}`]})
    }

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
                        <Button style={{marginTop:'20px'}}>
                        {t('add')}
                        </Button>
                    </div>

                </div>
            </Form>
        )}
        <List className="nodrag">
            {(radioPlaylist?.songs || []).map((radio, radioIndex) => {
                const info = getInfo(radio);

                return (
                    <ListItem key={info.path}>
                        <ListItemText primary={info.name}  style={{color: 'white'}}/>
                        <ListItemSecondaryAction>
                            <IconButton onClick={listenRadio(radio, radioIndex)} style={{color:'white'}}>
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