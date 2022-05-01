
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Paper, Popper, Slider } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { mpdVolume } from '../../../apis/mpdApi';
import storage, { STORAGE } from "../../../utils/storage";
import { HoverButton } from './Controls';

const Volume = () => {
    const [volumeOpen, setVolumOpen] = useState(false);
    const mpdMode = useSelector(state => state.app.mpdMode)
    const volume = useSelector(state => state.app.mpdStatus.volume)

    const onVolumeChange = (e, volume) => {       
        mpdVolume({}, {volume})   
        const source = document.querySelector('#casper_video')
        const mvolume = volume / 100;
        source.volume = mvolume
        storage.set(STORAGE.VOLUME, mvolume)        
    }   

    
    const toggleVolumeOpen = (e) => setVolumOpen(volumeOpen ? false : e.target);

    return (
        <>
            <HoverButton>
                <VolumeUpIcon style={{color:'white'}} onClick={toggleVolumeOpen}/>
            </HoverButton>
            {volumeOpen && (
                <Popper
                id="volume_popover"
                open
                anchorEl={volumeOpen}
                placement="top"
                >
                    <Paper style={{padding:'10px 5px', backgroundColor:'#161616', color:'white'}}>
                        <Slider value={volume} orientation="vertical" style={{height:"150px"}} onChange={onVolumeChange} />
                    </Paper>
                </Popper>
            )}
        </>
    )
}

export default Volume;