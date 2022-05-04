
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Paper, Popper, Slider } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { mpdVolume } from '../../../apis/mpdApi';
import storage, { STORAGE } from "../../../utils/storage";
import { HoverButton } from './Controls';

const Volume = () => {
    const [volumeOpen, setVolumeOpen] = useState(false);
    const volume = useSelector(state => state.app.mpdStatus?.volume || 0)

    const onVolumeChange = (e, volume) => {       
        mpdVolume({}, {params: [volume]})   
        const source = document.querySelector('#casper_video')
        const mvolume = volume / 100;
        source.volume = mvolume
        storage.set(STORAGE.VOLUME, mvolume)        
    }   

    
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
                    <Paper style={{padding:'10px 5px', backgroundColor:'#161616', color:'white'}}>
                        <Slider value={volume} orientation="vertical" style={{height:"150px"}} onChange={onVolumeChange} />
                    </Paper>
                </Popper>
            )}
        </>
    )
}

export default Volume;