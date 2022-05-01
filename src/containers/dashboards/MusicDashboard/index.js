import { AppBar, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Popover, Popper, Slider, Toolbar } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import TuneIcon from '@mui/icons-material/Tune';

import DashboardIcon from '../../../components/DashboardIcon';
import { useAuth } from '../../../redux/authSlice';
import { useDashboard , WINDOWS} from '../../../redux/dashboardSlice';
import storage, { STORAGE } from '../../../utils/storage';
import { mpdVolumeDown, mpdVolumeUp } from '../../../api';
import { useSelector } from 'react-redux';
import ProgressToolBar from './ProgressToolBar';
import Controls from './Controls';
import Volume from './Volume';

const MusicStyled = styled.div`
    height:100vh;
    width:100vw;
    position:relative;
    > div {
        width: 90px;
        height:120px;
        display:inline-block;
        position:relative;
    }
`

const MainMenuPopover = styled(Popover)`
    .MuiPaper-root{
        left:0 !important;
        border-radius: 0 !important;
    }
`

const HoverListItem = styled(ListItem)`
    &:hover{
        background: rgba(255,255,255,.2);
    }
`

const SmallList = styled(List)`
    .MuiListItem-root{
        padding: 16px 0;
        cursor:pointer;
        .MuiListItemIcon-root{
            display:flex;
            justify-content:center;
            color:white;
            padding: 0;
        }
        &:hover{
            background: rgba(255,255,255,.2);
        }

    }
`

const BrowserIcon = () => <img src="/icons/browser.png" alt="File browser" />
const YoutubeIcon = () => <img src="/icons/youtube.png" alt="Youtube icon" />
const SpectrumIcon = () => <img src="/icons/spectrum.png" alt="Spectrum icon" />
const PlaylistIcon = () => <img src="/icons/playlist.png" alt="Playlist icon" />
const RadioIcon = props => <img src="/icons/radio.png" alt="Radio icon" {...props} />
const ConfigIcon = () => <img src="/icons/config.png" alt="Config icon" />
const RemoteIcon = () => <img src="/icons/remote.png" alt="Remote icon" />


const Hour = () => {
    const [time, setTime] = useState(new Date())
    const [clock, setClock] = useState(null)

    useEffect(() => {
        setClock( setInterval(() => {
            setTime(new Date())
        }, 1000)  )

        return clearInterval(clock)
    }, [])

    return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', fontSize:'12px'}}>
        <span>{time.toLocaleTimeString()}</span>
        <span>{time.toLocaleDateString()}</span>
    </div>
        );

}

const Artist = () => {
    const current = useSelector(state => state.app.mpdStatus.current)
    
    return (
    <div style={{display:'flex', flexDirection:'column', fontSize:'12px'}}>
        {!current?.artist && !current?.title && current?.file && <span>{current?.file.split('/').reverse()[0]}</span>}
        <span>{current?.artist}</span>
        <span>{current?.title}</span>
    </div>
        );

}

const MainMenu = () => {
    const [mainMenuOpen, setMainMenuOpen] = useState(null)
    const dashboard = useDashboard()
    const auth = useAuth()    

    const show = windowUuid => () => {
        dashboard.showWindow(windowUuid);
        setMainMenuOpen(false)
    }

    return (
        <>
                <IconButton color="inherit" aria-label="open drawer" onClick={e => setMainMenuOpen(e.target.closest('#app_toolbar'))}>
                    <RadioIcon style={{height:'32px'}}/>
                </IconButton>
                {mainMenuOpen && (
                <MainMenuPopover
                    id="mainmenu"
                    open
                    anchorEl={mainMenuOpen}
                    onClose={() => setMainMenuOpen(null)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    anchorPosition={{
                        left: 0
                    }}
                    >
                        <div style={{height:'45vh', width:'300px', display:'flex', flexDirection:'row', backgroundColor:'#161616', color:'white'}}>
                            <div style={{width:'75px', boxShadow:'-1px 1px 3px white', flexDirection: 'column', gap:'5px', alignItems:'center', justifyContent:'end', display:'flex'}}>

<SmallList>
    <ListItem onClick={show(WINDOWS.PROFIL)}>
        <ListItemIcon style={{color:'white'}}>
            <AccountCircleIcon />
        </ListItemIcon>
    </ListItem>
    <ListItem onClick={show(WINDOWS.BROWSER)}>
        <ListItemIcon style={{color:'white'}}>
            <FolderOpenIcon />
        </ListItemIcon>
    </ListItem>
    <ListItem onClick={show(WINDOWS.CONFIG)}>
        <ListItemIcon style={{color:'white'}}>
            <SettingsIcon />
        </ListItemIcon>
    </ListItem>
    <ListItem onClick={() => auth.logout()}>
        <ListItemIcon style={{color:'white'}}>
            <LogoutIcon />
        </ListItemIcon>
    </ListItem>
</SmallList>

                            </div>
                            <div style={{maxHeight:'100%', overflow:'auto', width:'100%', paddingLeft:'5px'}}>
                                <List>
                                    <HoverListItem onClick={show(WINDOWS.PLAYLIST)}>
                                        <ListItemText primary="Playlist" />
                                    </HoverListItem>
                                    <HoverListItem onClick={show(WINDOWS.DOWNLOADER)}>
                                        <ListItemText primary="Youtube" />
                                    </HoverListItem>
                                    <HoverListItem onClick={show(WINDOWS.RADIO)}>
                                        <ListItemText primary="Radio" />
                                    </HoverListItem>
                                    <HoverListItem onClick={show(WINDOWS.SPECTRUM)}>
                                        <ListItemText primary="Spectrum" />
                                    </HoverListItem>
                                    <HoverListItem onClick={show(WINDOWS.REMOTE)}>
                                        <ListItemText primary="Télécommande" />
                                    </HoverListItem>
                                </List>
                            </div>

                        </div>
                </MainMenuPopover>
                )}      
                        </>
    )
}

const MusicDashboard = () => {
    const dashboard = useDashboard()
    const auth = useAuth()    

  const mpdStatus = useSelector(state => state.app.mpdStatus)
  const percent = mpdStatus?.time?.elapsed * 100 / mpdStatus?.time?.total
    const style = `
        #root{
            background-image: url(/music_dash/bg.jpg);
        }
        canvas{
            background: transparent !important;
        }
    `

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: style}} />
            <MusicStyled className="dashboard">           
                <div><DashboardIcon Icon={BrowserIcon} label={"window_browser"} onClick={() => dashboard.showWindow(WINDOWS.BROWSER)} /></div>
                <div><DashboardIcon Icon={YoutubeIcon} label={"window_downloader"} onClick={() => dashboard.showWindow(WINDOWS.DOWNLOADER)} /></div>
                <div><DashboardIcon Icon={SpectrumIcon} label={"window_spectrum"} onClick={() => dashboard.showWindow(WINDOWS.SPECTRUM)} /></div>
                <div><DashboardIcon Icon={PlaylistIcon} label={"window_playlist"} onClick={() => dashboard.showWindow(WINDOWS.PLAYLIST)} /></div>
                <div><DashboardIcon Icon={RadioIcon} label={"window_radios"} onClick={() => dashboard.showWindow(WINDOWS.RADIO)} /></div>
                <div><DashboardIcon Icon={ConfigIcon} label={"window_config"} onClick={() => dashboard.showWindow(WINDOWS.PROFIL)} /></div>
                <div><DashboardIcon Icon={RemoteIcon} label={"window_remote"} onClick={() => dashboard.showWindow(WINDOWS.REMOTE)} /></div>
                <div><DashboardIcon Icon={LogoutIcon} label={"window_logout"} onClick={() => auth.logout()} /></div>
                <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }} id="app_toolbar" style={{backgroundColor:'#161616'}}>
                    <ProgressToolBar variant="dense" progress={percent}>
                        <MainMenu />
                        <span style={{marginLeft:'auto', marginRight:'auto'}}>
                            <Artist />
                        </span>
                        <div style={{display:'flex', flexDirection:'row', gap:'5px', height:'100%', alignItems:'center'}}>
                            <Controls />
                            <Volume />
                            <Hour />
                        </div>
                    </ProgressToolBar>
                </AppBar>

            </MusicStyled>
        </>
    )
}

export default MusicDashboard