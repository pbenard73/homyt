
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { mpdClear, mpdDeleteId, mpdMoveId, mpdPlay, mpdRandom, mpdRepeat, mpdShuffle } from '../apis/mpdApi';

import {SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';

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
      const mpdIsRepeating = useSelector(state => state.app.mpdStatus?.repeat) === true
      const mpdIsRandom = useSelector(state => state.app.mpdStatus?.random) === true

    //const playAction = songIndex => listener.dispatch(EVENTS.ACTION_PLAY_SONG, {...playlist[songIndex], index: songIndex})

    const repeatMemo = useMemo(() => (
        <button onClick={() => mpdRepeat()}>{mpdIsRepeating ? 'ON REPEAT': 'NO REPEAT'}</button>
      ), [mpdIsRepeating])

      const randomMemo = useMemo(() => (
        <button onClick={() => mpdRandom()}>{mpdIsRandom ? 'ON RANDOM': 'NO RANDOM'}</button>

      ), [mpdIsRandom])

    return (
        <div className="nodradg">
            <button onClick={() => mpdShuffle()}>shuff</button>
            {repeatMemo}
            {randomMemo}
            <div style={{textAlign: 'right'}}>
                <IconButton onClick={() => mpdClear()}>
                    <DeleteSweepIcon />
                </IconButton>
            </div>
            <InnerPlaylist />
        </div>
    )

}
export default Playlist