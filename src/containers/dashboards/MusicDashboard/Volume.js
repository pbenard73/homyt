
import styled from 'styled-components'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Paper, Popper, Slider } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import { mpdVolume } from '../../../apis/mpdApi';
import { useApp } from '../../../redux/appSlice';
import { HoverButton } from './Controls';

const VolumeStyled = styled(Paper)`
    padding: 10px 5px;
    background-color: #161616 !important;
    display: flex;
    color: white;
    > div {
        display:flex;
        flex-direction: column;
        align-items:center;
        > svg {
            color: white;
            margin-bottom: 10px;
            height: .7em;
        }
    }
`

const Volume = () => {
    const app = useApp()
    const [volumeOpen, setVolumeOpen] = useState(false);
    const innerVolume = useSelector(state => state.app.volume || 0)
    const volume = useSelector(state => state.app.mpdStatus?.volume || 0)
    const servers = useSelector(state => state.app.config?.servers) || []

    const actualServer = servers.find(i => i.default === true);
    
    const toggleVolumeOpen = (e) => setVolumeOpen(volumeOpen ? false : e.target);

    return (
        <>
            <HoverButton onClick={toggleVolumeOpen} >
                <VolumeUpIcon style={{color:'white'}} />
            </HoverButton>
            {volumeOpen && (
                <Popper
                id="volume_popover"
                open
                anchorEl={volumeOpen}
                placement="top"
                >
                    <VolumeStyled >
                            {actualServer?.audioUrl && (
                        <div>
                            <ComputerIcon />
                            <Slider value={innerVolume * 100} orientation="vertical" style={{height:"150px"}} onChange={(e, newVolume) => app.setVolume(newVolume / 100)} />
                        </div>
                            )}

                        <div>
                            <StorageIcon />
                            <Slider value={volume} orientation="vertical" style={{height:"150px"}} onChange={(_, newVolume) =>  mpdVolume({}, {params: [newVolume]})} />
                        </div>
                    </VolumeStyled>
                </Popper>
            )}
        </>
    )
}

export default Volume;