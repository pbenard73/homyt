
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material'
import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSelector } from 'react-redux'
import { mpdLoadPlaylist } from '../apis/mpdApi';

const StoredPlaylist = () => {
  const playlists = useSelector(state => state.app.playlists)

    return (
        <div className="nodradg">
          StoredPlaylist
            <div style={{textAlign: 'right'}}>
            </div>

            <List>
              {playlists.map(playlist => (
                <ListItem key={playlist.name}>
                  <ListItemText primary={playlist.name} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => mpdLoadPlaylist({}, {name: playlist.name})}>
                      <PlayArrowIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
        </div>
    )

}
export default StoredPlaylist