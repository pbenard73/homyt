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
    &:after{
        content: '';
        position: absolute;
        bottom: 100%;
        height: 6px;
        background: #007ed7;
        width: ${props => props.progress || 0 }%;
        left: 0;
        pointer-events:none;
    }

    #progress_handler{
        position: absolute;
        bottom: 100%;
        height: 6px;
        left:0;
        width:100%;
        background:transparent;
        cursor:pointer;
    }
`

const ProgressToolBar = ({children, ...props}) => {
    const time = useSelector(state => state.app.mpdStatus.time)

    const onSeek = e => {
        const percent = Math.floor(e.pageX * time.total / document.body.offsetWidth);
        mpdSeek({}, {percent});
    }

    return (
        <ProgressToolBarThemed {...props}>
            {children}
            <div id="progress_handler" onClick={onSeek}></div>
        </ProgressToolBarThemed>
    )
}

export default ProgressToolBar;