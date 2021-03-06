import React, { useEffect, useState } from "react";
import { useApp } from "../redux/appSlice";
import socketIOClient from "socket.io-client";
import { nanoid } from 'nanoid'
import listener, { EVENTS } from "../utils/listener";
import player from './../utils/player'
import { useAuth } from "../redux/authSlice";

const GhostData = () => {
  const app = useApp()
  const auth = useAuth()
  const [uuid, setUuid] = useState(null)

  useEffect(() => {
    app.setFirstEntry();
    app.getConfig();
    auth.refreshSession();
    app.getFullTree();
    app.getPlaylists();

    const newUuid = nanoid()
    setUuid(nanoid(newUuid))

    const apiPath = process.env.REACT_APP_API
  
    const socketPath = apiPath !== '' ? apiPath : window.location.href

    const mySocket = socketIOClient(`${socketPath}?uuid=${newUuid}`, {
      withCredentials: true,
    });

    mySocket.on('stored_playlist', data => {
      app.getPlaylists(true)
    })

    mySocket.on('user_delete', data => {
      auth.checkUserDeletion(data)
    })

    mySocket.on('database', data => {
      app.getMpdPool();
    })

    mySocket.on('server_connection_error', data => {
      app.setError(data)
    })

    mySocket.on('config_change', data => {
      app.getConfig()
    })

    mySocket.on('volume', data => {
      if (data.target === newUuid) {
        listener.dispatch(EVENTS.REMOTE_VOLUME, data)
      }
    })

    mySocket.on('update', () => {
      app.willUpgrade()
      setTimeout(() => {
        window.location.reload()
      }, 15000)
    })

    mySocket.on('mpd_status', data => {
      app.setMpdStatus(data);
    })

    listener.register('remote_action_volume', EVENTS.REMOTE_ACTION_VOLUME , data => {
      mySocket.emit('volume', data)
    })

    listener.register('remote_action_next', EVENTS.REMOTE_ACTION_NEXT , data => {
      mySocket.emit('skip', {...data, next:true})
    })

    listener.register('remote_action_prev', EVENTS.REMOTE_ACTION_PREV , data => {
      mySocket.emit('skip', {...data, prev:true})
    })

    mySocket.on('skip', data => {
      if (data.target !== newUuid) {
        return 
      }

      const next = data.next === true

      const playlist = player.getPlaylist()
      const playIndex = player.getPlaylistIndex()
      const newIndex = playIndex + (next === true ? 1 : -1)

      if (newIndex > -1 && newIndex <= playlist.length -1) {
        listener.dispatch(EVENTS.ACTION_PLAY_SONG, {...playlist[newIndex], index: newIndex})
      }      
    })

    return () => mySocket.close()
  }, [])

  return (
    <span></span>
  )
}

export default GhostData;
