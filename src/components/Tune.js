
import styled from 'styled-components'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector } from 'react-redux';
import { mpdNext, mpdPause, mpdPlay, mpdPrevious, mpdSeek } from '../apis/mpdApi';
import { useState } from 'react';
import { IconButton, Paper, Popper, Slider, Typography } from '@mui/material';
import { mpdVolume } from '../apis/mpdApi';
import { getPicture } from '../api';

const CoverImage = styled('div')({
    width: 100,
    height: 100,
    objectFit: 'cover',
    overflow: 'hidden',
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    '& > img': {
      width: '100%',
    },
  });
  
  const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
  });

const TuneWrapper = styled(Paper)`
    width: 400px;
    height:250px;
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
        </TuneWrapper>                
    )
}

export default Tune