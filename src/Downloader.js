import React, {useEffect, useState} from 'react';
import {Paper, Drawer, TextField, Button, List, ListItem, ListItemIcon, IconButton, ListItemSecondaryAction, ListItemText, Avatar, Modal} from '@mui/material'
import socketIOClient from "socket.io-client";
import {download} from './api'
import styled from 'styled-components'
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import VideocamIcon from '@mui/icons-material/Videocam';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { search } from './api'

const Boutton = styled(Button)` 
  margin-top:20px;
`

const Reflex = styled(IconButton)`
-webkit-box-reflect: below -18px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4));
color:black;
`

const Form = styled.form`
  color:white;
  > div {
width: clamp(330px, 80vw, 800px);
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

const Papy = styled(Paper)`
width: clamp(330px, 80vw, 800px);
    background: transparent !important;
    margin-top:20px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(3px) hue-rotate(115deg);
    border: 3px solid #898989;
    box-shadow: 5px 8px 17px 9px rgb(0 0 0 / 76%);
    display:flex;
    flex-direction:column;
`

const Cli = styled.div`
    background: black;
    color: #9bf5ff;
    text-align: left;
    padding: 5px 10px;
`

const Momo = styled(Modal)`
display: flex;
    align-items: center;
    justify-content: center;
    iframe{
    border:5px solid black;

    @keyframes coco {
      from{
        box-shadow: 090px 101px 100px 0px red;
      }
      25%{
        box-shadow: 20px 500px 5px 0px yellow;
      }
      50%{
        box-shadow: -900px -110px 20px 0px purple;
      }
      75%{
        box-shadow: -30px 80px 80px 0px cyan;
      }
      to{
        box-shadow: 30px 150px 130px 0px lime;
      }
    }
    animation: coco 4s linear infinite alternate-reverse;
    }
    iframe + div {
    position:absolute;
    pointer-events:none;
    inset:0;
    &:before{
      content:'';
      opacity:.7;
      position:absolute;
      inset:0;
    animation: coco 5s 3s linear infinite alternate-reverse;
    }
    &:after{
      content:'';
      opacity:.7;
      position:absolute;
      inset:0;
    animation: coco 7s 2s linear infinite alternate-reverse;
    }
    }
`

const Downloader = ({folder}) => {
  const [url, setUrl] = useState('')
  const [realtime, setRealtime] = useState([])
  const [socket, setSocket] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [preview, setPreview] = useState(null)

  const toggleSearch = () => {
    setSearching(!searching)
  }

  const searchApi = async (e) => {
    e.preventDefault();
    const result = await search({query});

    setResults(result?.items || [])
  }

  useEffect(() => {
    const apiPath = process.env.REACT_APP_API

    const socketPath = apiPath !== '' ? apiPath : window.location.href

    const mySocket = socketIOClient(socketPath, {
      withCredentials: true,
    });

    mySocket.on("reset", data => {
      setRealtime([])
    });

    mySocket.on("msg", data => {
      console.log(data)
      setRealtime(o => ([...o, data]))
    });
    mySocket.on("end", data => {
      if (data.valid === true) {
        setRealtime(["Operation terminée avec succes"])
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

  const submitAction = async (e) => {
    e.preventDefault()

    const result = await download({}, {url, folder: folder.path})
  }

  const downloadAction = async videoId => {
    const result = await download({}, {url: `https://www.youtube.com/watch?v=${videoId}`, folder: folder.path})

    setResults([])

  }

  return (
    <div style={{textAlign:'center'}}>
    <AwesomeButton
    type="instagram"
    style={{marginBottom:'20px'}}
    onPress={toggleSearch}
    >
    {searching === true ? 'Video Url' : 'Search Video'}
    </AwesomeButton>
    {searching === false ? (
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

    {(results || []).length > 0 && (
      <Papy>
        <List>
          {results.map(result => (
            <ListItem>
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
      </Papy>
    )}


    {realtime.length > 0 && (<Cli>
      {realtime.map(i => <p>{i}</p>)}
      </Cli>
    )}

    {preview && (
      <Momo
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
      </Momo>
    )}
    </div>
  );
}

export default Downloader;
