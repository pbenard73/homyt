
import styled from 'styled-components'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector } from 'react-redux';
import { mpdNext, mpdPause, mpdPlay, mpdPrevious } from '../../../apis/mpdApi';

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
    const status = useSelector(state => state.app.mpdStatus)

    return (
        <>
            <HoverButton><TuneIcon /></HoverButton>
            <HoverButton><SkipPreviousIcon onClick={() => mpdPrevious()}/></HoverButton>
            <HoverButton>{status.state === 'play' ? <PauseIcon onClick={() => mpdPause()}/> : <PlayArrowIcon onClick={() => mpdPlay()}/>}</HoverButton>
            <HoverButton><SkipNextIcon onClick={() => mpdNext()}/></HoverButton>
        </>
    )
}

export default Controls