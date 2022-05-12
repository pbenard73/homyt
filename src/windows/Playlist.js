
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, TextField, Tooltip } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CasinoIcon from '@mui/icons-material/Casino';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { mpdClear, mpdDeleteId, mpdMoveId, mpdPlay, mpdSave, mpdShuffle } from '../apis/mpdApi';
import Button from '../components/Button'

import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
import { useApp } from '../redux/appSlice';
import { useState } from 'react';
import Form from '../components/Form';
import { useTranslation } from 'react-i18next';

const DragHandle = sortableHandle(() =>(
  <ListItemIcon className="dragger" style={{cursor:'grab'}}>
  <DragIndicatorIcon style={{color:'white'}} />
</ListItemIcon>
));


const SortableItem = SortableElement(({value: song}) => {
  const isRadio = (song.file || '').indexOf('http') === 0;

  const radioName = isRadio ? song.file.split('#').reverse()[0] : null;

  const title = radioName ? radioName : song.title || song.file.split('/').reverse()[0]

  return (
        <ListItem key={song.id}>
            <DragHandle />
            <ListItemText primary={title} secondary={song.artist} style={{ color: song.id === song.current ? '#38d7fb' : undefined }}/>
            <ListItemSecondaryAction>
                <IconButton onClick={() => mpdDeleteId({}, {params: [song.id]}) } style={{color:'white'}}>
                    <DeleteForeverIcon />
                </IconButton>
                <IconButton onClick={() => mpdPlay({}, {params: [song.songIndex]}) } style={{color:'white'}}>
                    <PlayArrowIcon />
                </IconButton>
            </ListItemSecondaryAction>                    
        </ListItem>
    )
  });


const SortableList = SortableContainer(({items}) => {
    return (
      <List className="nodrag">
        {items.map((value, index) => (
          <SortableItem key={`item-${value.id}`} index={index} value={value} />
        ))}
      </List>
    );
  });

const InnerPlaylist = () => {
    const mpdPlaylist = useSelector(state => JSON.stringify(state.app.mpdStatus?.playlist_info || []))
    const current = useSelector(state => state.app.mpdStatus?.current?.id || null)
    const items = JSON.parse(mpdPlaylist).map((song, songIndex) => ({...song, songIndex, current}));

    const playlistMemo = useMemo(() => (
        <SortableList
        useDragHandle
         items={items} 
         onSortEnd={({oldIndex, newIndex}) => {
            const song = items[oldIndex];

            mpdMoveId({}, {params: [song.id, newIndex]})
         }}
          />
    ), [mpdPlaylist, current])

    return playlistMemo
}

const Playlist = () => {
    const { t } = useTranslation()
      const app = useApp()

      const [newPlaylistName, setNewPlaylistName] = useState(null)

      const toggleSave = () => setNewPlaylistName(old => old === null ? '' : null);

      const saveAsAction = async (e) => {
        e.preventDefault()

        const { valid } = await mpdSave({}, {params: [newPlaylistName]})

        if (valid === true) {
          app.getPlaylists(true)
          setNewPlaylistName(null)
        }
      }
    return (
        <div className="nodrag">
            <div style={{display:'flex', alignItems: 'center'}}>
              <Button onClick={() => mpdShuffle()}>
                <CasinoIcon />
              </Button>
              <span style={{marginLeft:'auto'}}>
                <Tooltip title={t('save_as_playlist')} placement='top'>
                  <IconButton onClick={toggleSave}>
                      <SaveAsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('clear_playlist')} placement="top">
                  <IconButton onClick={() => mpdClear()}>
                      <DeleteSweepIcon />
                  </IconButton>
                </Tooltip>
              </span>
            </div>
            {newPlaylistName !== null && (
              <>
                <Form onSubmit={saveAsAction}>
                  <div>
                    <TextField label={t('playlist_name')} value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} />
                    <Button type="submit">{t('save')}</Button>
                  </div>
                </Form>
              </>
            )}
            <InnerPlaylist />
        </div>
    )

}
export default Playlist