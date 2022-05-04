
import styled from 'styled-components'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector } from 'react-redux';
import { mpdNext, mpdPause, mpdPlay, mpdPrevious } from '../../../apis/mpdApi';
import { useState } from 'react';
import { IconButton, Paper, Popper } from '@mui/material';
import Tune from '../../../components/Tune';

export const HoverButton = styled.span`
    cursor:pointer;
    padding: 0 10px;
    display: inline-flex;
    height: 100%;
    align-items: center;
    &:hover{
        background:grey;
    }
`

const Controls = () => {
    const status = useSelector(state => state.app.mpdStatus?.state)
    const [openTune, setOpenTune] = useState(null)

    const toggleTune = e => {
        if (openTune === null) {
            return setOpenTune(e.target.closest('#app_toolbar'))
        }

        setOpenTune(null)
    }

    return (
        <>
            <HoverButton onClick={toggleTune}><TuneIcon /></HoverButton>
            <HoverButton onClick={() => mpdPrevious()}><SkipPreviousIcon/></HoverButton>
            {status === 'play' ? (
                <HoverButton onClick={() => mpdPause()}><PauseIcon /></HoverButton>
            ) : (
                <HoverButton onClick={() => mpdPlay()}><PlayArrowIcon /></HoverButton>
            )}
            <HoverButton onClick={() => mpdNext()}><SkipNextIcon /></HoverButton>
            {openTune && (
                <Popper
                open
                anchorEl={openTune}
                placement="top"
                >
                    <Tune />
                </Popper>
            )}
        </>
    )
}

export default Controls