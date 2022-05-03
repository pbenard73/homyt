import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import SyncIcon from '@mui/icons-material/Sync';
import TreeView from '../TreeView'
import { useApp } from '../redux/appSlice';

const Browser = () => {
    const fullTree = useSelector(state => state.app.mpdPool)
    const app = useApp()

    return (
        <div className="nodrag">
            <div style={{textAlign:'right'}}>
                <Tooltip title={"UPDATE DB"}>
                    <IconButton onClick={() => app.update()}>
                        <SyncIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <TreeView tree={fullTree} />
        </div>
    )
}

export default Browser