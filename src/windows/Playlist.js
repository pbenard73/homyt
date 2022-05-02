
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import listener, { EVENTS } from '../utils/listener';
import { mpdPlay, mpdRandom, mpdRepeat, mpdShuffle } from '../apis/mpdApi';

const InnerPlaylist = () => {
    const mpdPlaylist = useSelector(state => JSON.stringify(state.app.mpdStatus?.playlist_info || []))
    const current = useSelector(state => state.app.mpdStatus?.current?.id || null)

    const playlistMemo = useMemo(() => (
        <List className="nodrag">
        {JSON.parse(mpdPlaylist).map((song, songIndex) => (
            <ListItem key={song.path}>
                <ListItemText primary={song.title || song.file.split('/').reverse()[0]} secondary={song.artist} style={{ color: song.id === current ? 'red' : undefined }}/>
                <ListItemSecondaryAction>
                    <IconButton onClick={() => mpdPlay({}, {index: songIndex}) } style={{color:'white'}}>
                        <PlayArrowIcon />
                    </IconButton>
                </ListItemSecondaryAction>                    
            </ListItem>
        ))} 
        </List>
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
        <>
        <button onClick={() => mpdShuffle()}>shuff</button>
        {repeatMemo}
        {randomMemo}
        <InnerPlaylist />
        </>
    )

}
export default Playlist