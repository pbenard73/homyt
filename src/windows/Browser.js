import React from 'react'
import { useSelector } from 'react-redux'
import { useApp } from '../redux/appSlice'
import TreeView from '../TreeView'

const Browser = () => {
    const app = useApp()
    const fullTree = useSelector(state => state.app.fullTree)

    return (
        <div>
            <TreeView tree={fullTree} />
        </div>
    )
}

export default Browser