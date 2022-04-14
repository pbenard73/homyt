import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useApp } from '../redux/appSlice'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import listener, { EVENTS } from '../utils/listener';
import { AwesomeButton } from "react-awesome-button";
import { addradio } from '../api'
import Form from '../components/Form'
import { useTranslation } from 'react-i18next'

const Radio = () => {
    const { t } = useTranslation()
    const [add, setAdd] = useState(false);
    const [newRadio, setNewRadio] = useState({name: '', path:''});
    const app = useApp()
    const radios = useSelector(state => state.app.radios);

    const playAction = songIndex => listener.dispatch(EVENTS.ACTION_PLAY_SONG, {index:0, radio:true, ...radios[songIndex]})

    const onSubmit = async e => {
        e.preventDefault()
        const {valid, files, radios} = await addradio({}, newRadio)

        if (valid !== false) {
            app.setRadios(radios)
            app.setFullTree(files)
            setAdd(false)
        }
    }

    return (
    <div style={{padding:'10px'}}>
        <AwesomeButton
        type="instagram"
        style={{marginRight:'20px'}}
        onPress={() => setAdd(!add)}
        className="nodrag"
        >
        {t('add_radio')}
        </AwesomeButton>
        {add && (
            <Form onSubmit={onSubmit} className="nodrag">
                <div>
                    <TextField label="Radio name" value={newRadio.name} onChange={e => setNewRadio({...newRadio, name: e.target.value})} />
                    <TextField label="Radio URL" value={newRadio.url} onChange={e => setNewRadio({...newRadio, path: e.target.value})} />
                    <div>
                        <AwesomeButton
                        type="instagram"
                        style={{marginTop:'20px'}}
                        >
                        {t('add')}
                        </AwesomeButton>
                    </div>

                </div>
            </Form>
        )}
        <List className="nodrag">
            {[...radios].sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1).map((radio, songIndex) => (
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
    
    </div>
)
    }
export default Radio