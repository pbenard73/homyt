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

const HumanStyled = styled.div`
    position:fixed;
    pointer-events:none;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:56px;
    color:white;
`

const Human = () => {
  const [time, setTime] = useState('')

  useEffect(() => {
    listener.register('human',  EVENTS.PLAYER_CURRENT_HUMAN, hm => setTime(hm))
  }, [])

  return (
  <HumanStyled>
    {time}      
  </HumanStyled>
)
  }
export default Human 