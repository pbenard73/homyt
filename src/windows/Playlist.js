
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, TextField, Tooltip } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { mpdClear, mpdConsume, mpdDeleteId, mpdMoveId, mpdPlay, mpdRandom, mpdRepeat, mpdSave, mpdShuffle } from '../apis/mpdApi';
import Button from '../components/Button'

import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
import { useApp } from '../redux/appSlice';
import { useState } from 'react';
import Form from '../components/Form';

const DragHandle = sortableHandle(() =>(
  <ListItemIcon className="dragger" style={{cursor:'grab'}}>
  <DragIndicatorIcon style={{color:'white'}} />
</ListItemIcon>
));


const SortableItem = SortableElement(({value: song}) => (
    <ListItem key={song.id}>
        <DragHandle />
        <ListItemText primary={song.title || song.file.split('/').reverse()[0]} secondary={song.artist} style={{ color: song.id === song.current ? '#38d7fb' : undefined }}/>
        <ListItemSecondaryAction>
            <IconButton onClick={() => mpdDeleteId({}, {params: [song.id]}) } style={{color:'white'}}>
                <DeleteForeverIcon />
            </IconButton>
            <IconButton onClick={() => mpdPlay({}, {params: [song.songIndex]}) } style={{color:'white'}}>
                <PlayArrowIcon />
            </IconButton>
        </ListItemSecondaryAction>                    
    </ListItem>
));


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
      const app = useApp()

      const mpdIsRepeating = useSelector(state => state.app.mpdStatus?.repeat) === true
      const mpdIsRandom = useSelector(state => state.app.mpdStatus?.random) === true
      const mpdIsConsume = useSelector(state => state.app.mpdStatus?.consume) === true

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

    //const playAction = songIndex => listener.dispatch(EVENTS.ACTION_PLAY_SONG, {...playlist[songIndex], index: songIndex})

    const repeatMemo = useMemo(() => (
        <Button onClick={() => mpdRepeat()}>{mpdIsRepeating ? 'ON REPEAT': 'NO REPEAT'}</Button>
      ), [mpdIsRepeating])

      const randomMemo = useMemo(() => (
        <Button onClick={() => mpdRandom()}>{mpdIsRandom ? 'ON RANDOM': 'NO RANDOM'}</Button>
      ), [mpdIsRandom])

      const consumeMemo = useMemo(() => (
        <Button onClick={() => mpdConsume()}>{mpdIsConsume ? 'ON CONSUME': 'NO CONSUME'}</Button>
      ), [mpdIsConsume])

    return (
        <div className="nodradg">
            <button onClick={() => mpdShuffle()}>shuff</button>
            {repeatMemo}
            {randomMemo}
            {consumeMemo}
            <div style={{textAlign: 'right'}}>
              <Tooltip title="Save as playlist" placement='top'>
                <IconButton onClick={toggleSave}>
                    <SaveAsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="clear all" placement="top">
                <IconButton onClick={() => mpdClear()}>
                    <DeleteSweepIcon />
                </IconButton>
              </Tooltip>
            </div>
            {newPlaylistName !== null && (
              <>
                <Form onSubmit={saveAsAction}>
                  <div>
                    <TextField label="Playlist's name" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} />
                    <Button type="submit">Save</Button>
                  </div>
                </Form>
              </>
            )}
            <InnerPlaylist />
        </div>
    )

}
export default Playlist