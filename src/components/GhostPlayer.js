import React, {useEffect, useMemo, useState} from 'react';
import {Paper, Drawer, TextField, Button, List, ListItem, ListItemIcon, IconButton, ListItemSecondaryAction, ListItemText, Avatar, Modal} from '@mui/material'
import socketIOClient from "socket.io-client";
import {download, listen} from '../api'
import styled from 'styled-components'
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import VideocamIcon from '@mui/icons-material/Videocam';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { search } from '../api'
import { useRef } from 'react';
import { LocalDining } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useApp } from '../redux/appSlice';
import listener, { EVENTS } from '../utils/listener';

const CasperVideo = styled.video`
    display:none;
`

const GhostPlayer = () => (
  <CasperVideo
   controls 
    id="casper_video"
   onPlay={(...args) => listener.dispatch(EVENTS.PLAYER_START, ...args)} 
   onPause={(...args) => listener.dispatch(EVENTS.PLAYER_PAUSE, ...args)} 
   onEnded={(...args) => listener.dispatch(EVENTS.PLAYER_END, ...args)}
   onTimeUpdate={(...args) => listener.dispatch(EVENTS.PLAYER_TIME_UPDATE, ...args)}
   onLoadedMetadata={(...args) => listener.dispatch(EVENTS.PLAYER_META, ...args)}
   crossOrigin="anonymous"
   >
    <source />       
  </CasperVideo>
)

export default GhostPlayer;
