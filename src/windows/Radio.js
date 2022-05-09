import { Autocomplete, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RADIO_PLAYLIST_NAME, useApp } from '../redux/appSlice'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import SaveIcon from '@mui/icons-material/Save';
import listener, { EVENTS } from '../utils/listener';
import { addradio } from '../api'
import Form from '../components/Form'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button';
import { getCloudRadiosList } from '../apis/publicApi'
import { mpdAddToPlaylist, mpdDeleteFromPlaylist, mpdListenRadio } from './../apis/mpdApi'
import axios from 'axios';

const Radio = () => {
    const { t } = useTranslation()
    const app = useApp()
    const playlists = useSelector(state => state.app.playlists)


    const [add, setAdd] = useState(false);
    const [newRadio, setNewRadio] = useState({name: '', path:''});
    const [importRadio, setImportRadio] = useState(false)
    const [radioList, setRadioList] = useState(null)

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

    const listenRadio = (_, radioIndex) => async () => {
        await mpdListenRadio({}, {params: [RADIO_PLAYLIST_NAME, `${radioIndex}:${radioIndex + 1}`]})
    }

    const deleteRadio = radio => async () => {
        await mpdDeleteFromPlaylist({}, {params: [RADIO_PLAYLIST_NAME, radio.baseIndex]})
    }

    const radioPlaylist = (playlists || []).find(i => i.name === RADIO_PLAYLIST_NAME);
    const songs = [...(radioPlaylist?.songs || [])].map((radio, baseIndex) => ({
        ...radio,
        baseIndex
     }))

    songs.sort((a, b) => {
        let {name: aName} = getInfo(a) 
        let {name: bName} = getInfo(b)

        return aName.toLowerCase() < bName.toLowerCase() ? -1 : 1;
    })

    const importAction = async () => {
        if (radioList === null) {
            const cloudRadioList = await getCloudRadiosList()

            setRadioList(cloudRadioList)
        }

        setImportRadio(true);        
    }

    const toggleImport = () => {
        if (importRadio === false) {
            return importAction()
        }

        setImportRadio(false);
    }

    const formFields = fieldName => ({
        onChange: e => setNewRadio({...newRadio, [fieldName]: e.target.value}),
        value: newRadio[fieldName]
    })

    return (
    <div style={{padding:'10px'}}>
        <Button
            style={{marginBottom:'10px'}}
            onClick={() => setAdd(!add)}
        >
        {t('add_radio')}
        </Button>
        {add && (
            <Form onSubmit={onSubmit} className="nodrag">
                <div>
                    <div style={{textAlign:'right'}}>
                        <Button type="button" onClick={toggleImport} style={{marginBottom:'10px'}}>
                            <CloudDownloadIcon />
                        </Button>
                    </div>
                    {radioList && importRadio && (
                        <Autocomplete
                            renderInput={(params) => <TextField {...params} label="Movie" />}
                            options={radioList.sort(({name: aName}, {name: bName}) => aName.toLowerCase() < bName.toLowerCase() ? -1 : 1)}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, newValue) => {
                                setNewRadio(newValue)
                                setImportRadio(false)
                            }}
                        />
                    )}
                    <TextField label="Radio name" {...formFields('name')} style={{marginBottom:'10px'}} />
                    <TextField label="Radio URL" {...formFields('path')} />
                    
                    <div style={{textAlign: 'right'}}>
                        <Button type="submit" style={{marginTop:'20px'}}>
                            <SaveIcon />
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