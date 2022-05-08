import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {Drawer, TextField, List, ListItem, ListItemIcon, IconButton, ListItemSecondaryAction, ListItemText, Avatar} from '@mui/material'

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
import Button from '../components/Button'
import Form from '../components/Form'
import { useTranslation } from 'react-i18next'

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

const Reflex = styled(IconButton)`
-webkit-box-reflect: below -18px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4));
color:black;
`

const Downloader = () => {
    const app = useApp()
    const { t } = useTranslation()
    const [mode, setMode] = useState(MODE.SEARCH)
    const [folder, setFolder] = useState(null)
    const [folderModal, setFolderModal] = useState(false)
    const fullTree = useSelector(state => state.app.mpdPool)
    const servers = useSelector(state => state.app.config?.servers) || []
    const searchDownload = useSelector(state => state.app.searchDownload)

    const actualServer = servers.find(server => server.default === true && server.internal === true);

    const [url, setUrl] = useState('')
    const [realtime, setRealtime] = useState(null)
    const [socket, setSocket] = useState(null)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
      if (searchDownload === null) {
        return
      }

      setMode(MODE.SEARCH);
      setQuery(searchDownload);
      app.eraseSearchDownload();
    }, [searchDownload])

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
          setRealtime([t("convert_succesfull")])
          app.getFullTree()
        } else {
          setRealtime(["error"])
        }
      });
  
        setSocket(mySocket)
  
      return () => {
        document.querySelector('#root').classList.remove('getaround')
        socket?.close?.()
      }
    }, []);

    if (!actualServer) {
      return (
        <p>Server is not configured to download music</p>
      )
    }

    const toggleMode = () => setMode(o => o === MODE.DOWNLOAD ? MODE.SEARCH : MODE.DOWNLOAD)


    const searchApi = async (e) => {
        e.preventDefault();
        const result = await search({query});
    
        setResults(result?.items || [])
      }

      const submitAction = async (e) => {
        e.preventDefault()
    
        await download({}, {url, folder: folder.path})
      }
    
      const downloadAction = async videoId => {
        const result = await download({}, {url: `https://www.youtube.com/watch?v=${videoId}`, folder})
    
        setResults([])
      }

      const searchResults = (results || []).length > 0 && (
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
      );

      const selectFolderModal = folderModal && (
          <Modal
          open
          onClose={() => setFolderModal(false)}
          >
              <Paper className="nodrag" style={{maxHeight:'80vh', overflow: 'auto'}}>
                  <TreeView tree={fullTree} setFolder={folderPath => {setFolder(folderPath); setFolderModal(false)}}/>
              </Paper>
          </Modal>
      );

      

      const realtimeRenderer = realtime !== null && <Cli><p>{realtime}</p></Cli>

      const previewModal = preview && (
        <Modal
        open
        onClose={() => {
          document.querySelector('#root').classList.remove('getaround')
          setPreview(null)
        }}
        >
          <div style={{position:'relative'}}>
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${preview}?autoplay=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay></iframe>
            <div></div>
          </div>
        </Modal>
      )

    return (
        <>
          <div className="nodrag" style={{padding:'10px', color:'white'}}> 
            <div style={{marginBottom:'20px'}}>
                <Button
                  style={{marginRight:'20px'}}
                  onClick={toggleMode}
                >
                  {mode === MODE.DOWNLOAD ? t('mode_search_video') : t('mode_url')}
                </Button>
                <Button onClick={() => setFolderModal(true)}>
                  {t('target_folder')}
                </Button>

                {folder}
            </div>
            {folder !== null && (
              <div>
              {mode === MODE.DOWNLOAD ? (
                  <Form onSubmit={submitAction}>
                  <div>
                      <TextField autoComplete="off" label={t('video_url')} value={url} required onChange={e => setUrl(e.target.value)} />
                      <div>
                          <Button style={{marginTop:'20px'}}>
                            {t('download')}
                          </Button>
                      </div>
                  </div>
                  </Form>
                  ) : (
                  <Form onSubmit={searchApi}>
                      <div>
                      <TextField autoComplete="off" label={t('video_keywords')} value={query} required onChange={e => setQuery(e.target.value)} />
                      <div>
                          <Button type="submit" style={{marginTop:'20px'}}>
                          {t('search')}
                          </Button>
                      </div>
                  </div>
                  </Form>
              )}
              </div>
            )}

            {searchResults}

            {realtimeRenderer}
          </div>

          {selectFolderModal}

          {previewModal}
        </>
    )
}

export default Downloader