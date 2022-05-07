import { IconButton, List, ListItem, ListItemIcon, ListItemText, Popover } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import styled from 'styled-components'
import { useState } from "react"
import { useAuth } from "../../../redux/authSlice"
import { useDashboard, WINDOWS } from "../../../redux/dashboardSlice"

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

const RadioIcon = props => <img src="/icons/radio.png" alt="Radio icon" {...props} />

const StartMenu = () => {
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
                                    <HoverListItem onClick={show(WINDOWS.STORED_PLAYLISTS)}>
                                        <ListItemText primary="Stored Playlists" />
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

export default StartMenu