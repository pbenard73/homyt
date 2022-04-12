import React, { useEffect, useState } from "react";
import { useApp } from "../redux/appSlice";
import socketIOClient from "socket.io-client";
import { nanoid } from 'nanoid'
import listener, { EVENTS } from "../utils/listener";
import player from './../utils/player'

function GhostData() {
  const app = useApp()
  const [uuid, setUuid] = useState(null)

  useEffect(() => {
    app.getFullTree();
    const newUuid = nanoid()
    setUuid(nanoid(newUuid))

    const apiPath = process.env.REACT_APP_API
  
    const socketPath = apiPath !== '' ? apiPath : window.location.href

    const mySocket = socketIOClient(`${socketPath}?uuid=${newUuid}`, {
      withCredentials: true,
    });

    mySocket.on('volume', data => {
      if (data.target === newUuid) {
        listener.dispatch(EVENTS.REMOTE_VOLUME, data)
      }
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
