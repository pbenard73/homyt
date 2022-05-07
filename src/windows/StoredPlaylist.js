
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSelector } from 'react-redux'
import { mpdLoadPlaylist, mpdMovePlaylist } from '../apis/mpdApi';
import { useState } from 'react';
import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
import Button from '../components/Button';

const DragHandle = sortableHandle(() =>(
  <ListItemIcon className="dragger" style={{cursor:'grab'}}>
  <DragIndicatorIcon style={{color:'white'}} />
</ListItemIcon>
));


const SortableItem = SortableElement(({value: song}) => (
    <ListItem key={song.id}>
        <DragHandle />
        <ListItemText primary={song.title || song.file.split('/').reverse()[0]} secondary={song.artist} />
        <ListItemSecondaryAction>
          
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

const StoredPlaylist = () => {
  const playlists = useSelector(state => state.app.playlists)
  const [edit, setEdit] = useState(null)

  const renderPlaylist = () => (
    <>
      <div style={{display: 'flex', alignItems:'center', position: 'sticky', top:'0', zIndex:2}}>
        <h2>{edit}</h2>
        <Button style={{marginLeft:'auto'}} onClick={() => setEdit(null)}>
          <CloseIcon />
        </Button>
      </div>
      <SortableList 
        items={playlists.find(i => i.name === edit).songs} 
        useDragHandle
        onSortEnd={({oldIndex, newIndex}) => {
          mpdMovePlaylist({}, {params: [edit, oldIndex, newIndex]})
        }}        
      />
    </>
  )

  const getList = (
    <List>
      {playlists.map(playlist => (
        <ListItem key={playlist.name}>
          <ListItemText primary={playlist.name} />
          <ListItemSecondaryAction>
            <IconButton onClick={() => setEdit(playlist.name)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => mpdLoadPlaylist({}, {name: playlist.name})}>
              <PlayArrowIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )

  return (
      <div className="nodradg" style={{padding:'10px'}}>
          {!edit ? getList : renderPlaylist()}
      </div>
  )
}

export default StoredPlaylist
