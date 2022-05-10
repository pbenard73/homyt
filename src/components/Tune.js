
import styled from 'styled-components'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import { useSelector } from 'react-redux';
import { mpdConsume, mpdNext, mpdPause, mpdPlay, mpdPrevious, mpdRandom, mpdRepeat, mpdSeek } from '../apis/mpdApi';
import { IconButton, Paper, Slider, Tooltip, Typography } from '@mui/material';
import { mpdVolume } from '../apis/mpdApi';
import { getPicture } from '../api';
import { useMemo } from 'react';

const CoverImage = styled.div`
    width: 100px;
    height: 100px;
    object-fit: cover;
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 8px;
    background-color: rgba(0,0,0,0.08);
    & > img {
      width: 100%;
    },
`

const TuneWrapper = styled(Paper)`
    width: 400px;
    height:280px;
    padding:20px;
    border-radius: 0px !important;
    background-color: rgba(0,0,0,.9) !important;
    color:white !important;
    transform: translateY(-10px);
    > div:nth-child(1){
        display:flex;
    }
    > div:nth-child(2){}
    > div:nth-child(3){
        display:flex;
        justify-content:center;
        > button {
            svg {
                height:30px;
                width:30px;
                fill:white;
            }
            &:nth-child(2) {
                margin: 0 15px;
                svg {
                    height:66px;
                    width:66px;
                }
            }
        }
    }
    > div:nth-child(4){
        display:flex;
    }
`

const Tune = () => {
    const mpdStatus = useSelector(state => state.app.mpdStatus) || {}
    const mpdIsRepeating = useSelector(state => state.app.mpdStatus?.repeat) === true
    const mpdIsRandom = useSelector(state => state.app.mpdStatus?.random) === true
    const mpdIsConsume = useSelector(state => state.app.mpdStatus?.consume) === true

    const percent = mpdStatus?.time?.elapsed * 100 / mpdStatus?.time?.total
    const {artist, title, file} = (mpdStatus?.current || {})


    const onVolumeChange = (e, volume) => {       
        mpdVolume({}, {params: [volume]})  
    }  

    const onSeek = (e, value) => {
        const percent = Math.floor(mpdStatus?.time?.total * value / 100);
        mpdSeek({}, {params: [percent]});
    }

    const isRadio = file.indexOf('http') === 0;

    const repeatMemo = useMemo(() => (
        <Tooltip title={"Mode repeat"} placement="top">
            <IconButton onClick={() => mpdRepeat()} style={{color: mpdIsRepeating ? 'white': 'grey'}}>
                <RepeatIcon style={{height:'.8em'}}/>
            </IconButton>
        </Tooltip>
      ), [mpdIsRepeating])

      const randomMemo = useMemo(() => (
        <Tooltip title={"Mode Random"} placement="top">
         <IconButton onClick={() => mpdRandom()} style={{color: mpdIsRandom ? 'white': 'grey'}}>
             <ShuffleIcon style={{height:'.8em'}}/>
        </IconButton>
        </Tooltip>
      ), [mpdIsRandom])

      const consumeMemo = useMemo(() => (
        <Tooltip title={"Mode Consume"} placement="top">
        <IconButton onClick={() => mpdConsume()}  style={{color: mpdIsConsume ? 'white': 'grey'}}>
            <CancelScheduleSendIcon style={{height:'.8em'}}/>
            </IconButton>
        </Tooltip>
      ), [mpdIsConsume])


    return(
        <TuneWrapper>
            <div>
                <CoverImage>
                    <img src={getPicture.url({path: file?.replace?.(/\./g, '_'), query: title, radio: isRadio})} alt="cover"/>
                </CoverImage>
                <div style={{padding:'5px 16px'}}>
                    <Typography variant="caption">{artist}</Typography>
                    <Typography noWrap><b>{title}</b></Typography>
                </div>
            </div>
            <div>
                <Slider 
                value={percent}
                onChange={onSeek}
                />
            </div>
            <div>
                <IconButton onClick={() => mpdPrevious()}><SkipPreviousIcon/></IconButton>
                {mpdStatus?.state === 'play' ? (
                    <IconButton onClick={() => mpdPause()}><PauseIcon /></IconButton>
                ) : (
                    <IconButton onClick={() => mpdPlay()}><PlayArrowIcon /></IconButton>
                )}
                <IconButton onClick={() => mpdNext()}><SkipNextIcon /></IconButton>
            </div>
            <div>
                <VolumeDownIcon />
                <Slider 
                value={mpdStatus?.volume || 0}
                onChange={onVolumeChange} 
                />
                <VolumeUpIcon />
            </div>
            <div>
                    {repeatMemo}
                    {randomMemo}
                    {consumeMemo}
            </div>
        </TuneWrapper>                
    )
}

export default Tune