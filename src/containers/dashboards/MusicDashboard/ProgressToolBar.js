import { Toolbar } from '@mui/material'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { mpdSeek } from '../../../apis/mpdApi'

const ProgressToolBarThemed = styled(Toolbar)`
    height:48px;
    position:relative;
    &:before{
        content: '';
        position: absolute;
        bottom: 100%;
        height: 6px;
        background: #303030;
        width: 100%;
        left: 0;
        pointer-events:none;
    }
`

const ThemedSeekHandler = styled.div`
    position: absolute;
    bottom: 100%;
    height: 6px;
    left:0;
    width:100%;
    background:transparent;
    cursor:pointer;
    &:before{
        content: '';
        position: absolute;
        top: 0;
        height: 6px;
        background: #007ed7;
        width: ${props => props.progress || 0 }%;
        max-width:100vw;
        left: 0;
        pointer-events:none;
    }
`

const SeekHandler = () => {
    const mpdStatus = useSelector(state => state.app.mpdStatus)
    const percent = mpdStatus?.time?.elapsed * 100 / mpdStatus?.time?.total
    
    const onSeek = e => {
        const percent = Math.floor(e.pageX * mpdStatus?.time?.total / document.body.offsetWidth);
        mpdSeek({}, {params: [percent]});
    }

    return (
        <ThemedSeekHandler progress={percent} onClick={onSeek} />
    )
}

const ProgressToolBar = ({children, ...props}) => (
        <ProgressToolBarThemed {...props}>
            {children}
            <SeekHandler />
        </ProgressToolBarThemed>
    )

export default ProgressToolBar;