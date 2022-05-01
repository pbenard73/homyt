
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import listener, { EVENTS } from '../utils/listener';
import { mpdPlay, mpdRandom, mpdRepeat, mpdShuffle } from '../apis/mpdApi';

const Playlist = () => {
    const {playlist, playIndex} = useSelector(state => ({
        playlist: state.app.playlist,
        playIndex: state.app.playIndex
      }))

      const mpdMode = useSelector(state => state.app.mpdMode)
      const mpdPlaylist = useSelector(state => state.app.mpdStatus?.playlist_info)
      const mpdIsRepeating = useSelector(state => state.app.mpdStatus?.repeat)
      const mpdIsRandom = useSelector(state => state.app.mpdStatus?.random)

    const playAction = songIndex => listener.dispatch(EVENTS.ACTION_PLAY_SONG, {...playlist[songIndex], index: songIndex})

      if (mpdMode) {
          return (
              <>
              <button onClick={() => mpdShuffle()}>shuff</button>
              <button onClick={() => mpdRepeat()}>{mpdIsRepeating ? 'ON REPEAT': 'NO REPEAT'}</button>
              <button onClick={() => mpdRandom()}>{mpdIsRandom ? 'ON RANDOM': 'NO RANDOM'}</button>
            <List className="nodrag">
            {(mpdPlaylist || []).map((song, songIndex) => (
                <ListItem key={song.path}>
                    <ListItemText primary={song.title || song.file.split('/').reverse()[0]} secondary={song.artist}/>
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => mpdPlay({}, {index: songIndex}) } style={{color:'white'}}>
                            <PlayArrowIcon />
                        </IconButton>
                    </ListItemSecondaryAction>                    
                </ListItem>
            ))} 
            </List>
            </>
          )
      }

    return (   
        <List className="nodrag">
            {playlist.map((song, songIndex) => (
                <ListItem key={song.path}>
                    <ListItemText primary={song.name}  style={{color: songIndex === playIndex ? 'red' : 'white'}}/>
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => playAction(songIndex) } style={{color:'white'}}>
                            <PlayArrowIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    )
}
export default Playlist