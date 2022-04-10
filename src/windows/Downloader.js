import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {Drawer, TextField, Button, List, ListItem, ListItemIcon, IconButton, ListItemSecondaryAction, ListItemText, Avatar} from '@mui/material'

import { useApp } from '../redux/appSlice'
import TreeView from '../TreeView'
import { AwesomeButton } from "react-awesome-button";
import Modal from '../components/Modal';
import Paper from '../components/Paper';
import styled from 'styled-components'
import socketIOClient from "socket.io-client";
import { search, download } from './../api'
import VideocamIcon from '@mui/icons-material/Videocam';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const MODE = {
    DOWNLOAD: 'download',
    SEARCH: 'search'
}
const Cli = styled.div`
    background: black;
    color: #9bf5ff;
    text-align: left;
    padding: 5px 10px;
`
const Form = styled.form`
  color:white;
  > div {
    background: rgb(255 255 255 / 31%);
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(3px) hue-rotate(115deg);
    border: 3px solid #898989;
    box-shadow: 5px 8px 17px 9px rgb(0 0 0 / 76%);
    display:flex;
    flex-direction:column;
  }
`

const Reflex = styled(IconButton)`
-webkit-box-reflect: below -18px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4));
color:black;
`

const Downloader = () => {
    const app = useApp()
    const [mode, setMode] = useState(MODE.SEARCH)
    const [folder, setFolder] = useState(null)
    const [folderModal, setFolderModal] = useState(false)
    const fullTree = useSelector(state => state.app.fullTree)

    const [url, setUrl] = useState('')
    const [realtime, setRealtime] = useState(null)
    const [socket, setSocket] = useState(null)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)
    const [searching, setSearching] = useState(false)
    const [preview, setPreview] = useState(null)



    useEffect(() => {
        const apiPath = process.env.REACT_APP_API
    
        const socketPath = apiPath !== '' ? apiPath : window.location.href
    
        const mySocket = socketIOClient(socketPath, {
          withCredentials: true,
        });
    
        mySocket.on("reset", data => {
          setRealtime(null)
        });
    
        mySocket.on("msg", data => {
          console.log(data)
          setRealtime(data)
        });
        mySocket.on("end", data => {
          if (data.valid === true) {
            setRealtime(["Operation terminée avec succes"])
            app.getFullTree()
          } else {
            setRealtime(["Erreur"])
          }
        });
    
         setSocket(mySocket)
    
        return () => {
          document.querySelector('#root').classList.remove('getaround')
          socket?.close?.()
        }
      }, []);

    const toggleMode = () => setMode(o => o === MODE.DOWNLOAD ? MODE.SEARCH : MODE.DOWNLOAD)


    const searchApi = async (e) => {
        e.preventDefault();
        const result = await search({query});
    
        setResults(result?.items || [])
      }

      const submitAction = async (e) => {
        e.preventDefault()
    
        const result = await download({}, {url, folder: folder.path})
      }
    
      const downloadAction = async videoId => {
        const result = await download({}, {url: `https://www.youtube.com/watch?v=${videoId}`, folder: folder.path})
    
        setResults([])
      }

    return (
        <>
            <div style={{padding:'10px', color:'white'}}> 
                <div>
                    <AwesomeButton
                    type="instagram"
                    style={{marginRight:'20px'}}
                    onPress={toggleMode}
                    >
                    {mode === MODE.DOWNLOAD ? 'Video Url' : 'Search Video'}
                    </AwesomeButton>
                    <AwesomeButton
                    type="instagram"
                    onPress={() => setFolderModal(true)}
                    >
                    Destination
                    </AwesomeButton>

                    {folder && folder.path}
                </div>
{folder !== null && (
                <div>
                {mode === MODE.DOWNLOAD ? (
                    <Form onSubmit={submitAction}>
                    <div>
                        <TextField label="Video Url" value={url} required onChange={e => setUrl(e.target.value)} />
                        <div>
                            <AwesomeButton
                            type="instagram"
                            style={{marginTop:'20px'}}
                            >
                            Download
                            </AwesomeButton>
                        </div>
                    </div>
                    </Form>
                    ) : (

                    <Form onSubmit={searchApi}>
                        <div>
                        <TextField label="Find a video" value={query} required onChange={e => setQuery(e.target.value)} />
                        <div>
                            <AwesomeButton
                            type="instagram"
                            style={{marginTop:'20px'}}
                            >
                            Find
                            </AwesomeButton>
                        </div>
                    </div>
                    </Form>
                )}
                </div>
)}



                {(results || []).length > 0 && (
      <Paper>
        <List>
          {results.map(result => (
            <ListItem style={{color:'white'}}>
            <ListItemIcon>
              <Avatar variant="square" src={result.snippet?.thumbnails?.default?.url}>
                
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={result?.snippet?.title} />
            <ListItemSecondaryAction>
              <Reflex onClick={() => downloadAction(result?.id?.videoId)}>
                <CloudDownloadIcon />
              </Reflex >
              <Reflex onClick={() => {
                document.querySelector('#root').classList.add('getaround')
                setPreview(result?.id?.videoId)
              }}>
            <VideocamIcon />
              </Reflex>

              
            </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    )}

      {realtime !== null && <Cli><p>{realtime}</p></Cli>}
            </div>

            {folderModal && (
                <Modal
                open
                onClose={() => setFolderModal(false)}
                >
                    <Paper className="nodrag">
                        <TreeView tree={fullTree} setFolder={leaf => {setFolder(leaf); setFolderModal(false)}} select/>
                    </Paper>
                </Modal>
            )}

{preview && (
      <Modal
      open
      onClose={() => {
        document.querySelector('#root').classList.remove('getaround')
        setPreview(null)
      }}
      >
      <>
      <div style={{position:'relative'}}>
        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${preview}?autoplay=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay></iframe>
      <div></div>
      </div>
      </>
      </Modal>
    )}

        </>
    )
}

export default Downloader