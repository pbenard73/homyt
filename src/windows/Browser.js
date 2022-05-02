import React from 'react'
import { useSelector } from 'react-redux'
import TreeView from '../TreeView'

const Browser = () => {
    const fullTree = useSelector(state => state.app.mpdPool)

    return (
        <div className="nodrag">
            <TreeView tree={fullTree} />
        </div>
    )
}

export default Browser