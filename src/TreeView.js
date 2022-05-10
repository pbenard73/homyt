import React, { useState } from "react";
import { IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import styled from "styled-components";
import { useApp } from "./redux/appSlice";
import { mpdAdd } from "./apis/mpdApi";


const LeafItem = styled(ListItem)`
  flex-direction: column;
  align-items: start !important;
  position:relative;
  .MuiListItemSecondaryAction-root {
    top: 26px;
  }
  .children_leaf {
    width: 100%;
  }
  .actions {   
     svg {
       fill: white;
     }
  }
  .MuiListItemIcon-root,
  .MuiListItemText-root{
    color: white
  }
`;

const TreeView = ({ tree, setFolder }) => {
  const [open, setOpen] = useState([])

  const toggle = (leafPath) => {
    const newOpen = [...open]

    if (newOpen.indexOf(leafPath) !== -1) {
      return setOpen(o => o.filter(i => i !== leafPath))
    }

    setOpen(o => [...o, leafPath])
  }

  const renderName = (item, parentPath = '') => {
    if (item.directory) {
      return item.directory.replace(parentPath, '')
    }

    if (item.title) {
      return `${item.title} - ${item.artist}`
    }

    if (item.file) {
      return item.file.replace(parentPath, '')
    }
  }

  const renderTree = (children, parentName = '', files = false) => children.map(leaf => (
    <LeafItem key={files === false ? leaf.directory : leaf.file }>
      <div style={{flexDirection:'row', display:'flex'}}>

      {files === false && (
        <ListItemIcon style={{alignItems:'center'}}>
          <FolderIcon />
        </ListItemIcon>
      )}
      <ListItemText primary={renderName(leaf, parentName)} onClick={files === true ? undefined : () => toggle(leaf.directory)}/>
      </div>
      <ListItemSecondaryAction className="actions">
          {setFolder ? (
              <IconButton onClick={() => setFolder(leaf.directory)}>
                <PlaylistPlayIcon />
              </IconButton>
            ) : (
            <>
              <IconButton onClick={() => {
                mpdAdd({}, {path: files === true ? leaf.file : leaf.directory})
              }}>
                <AddCircleIcon />
              </IconButton>
              <IconButton onClick={() => {
                mpdAdd({}, {path: files === true ? leaf.file : leaf.directory, play:true})
              }}>
                <PlaylistPlayIcon />
              </IconButton>
              <IconButton onClick={() => {
                mpdAdd({}, {path: files === true ? leaf.file : leaf.directory, play:true, clear: true})
              }}>
                <PlayCircleIcon />
              </IconButton>
            </>
          )}
      </ListItemSecondaryAction>
      {files === false && !setFolder && (
       <div className="children_leaf">
         <List>
          {Array.isArray(leaf.directories) === true && leaf.directories.length > 0 && open.indexOf(leaf.directory) !== -1 && renderTree(leaf.directories, leaf.directory)}
          {Array.isArray(leaf.file) === true && leaf.file.length > 0 && open.indexOf(leaf.directory) !== -1 && renderTree(leaf.file, leaf.directory, true)}
         </List>
       </div>
      )}
    </LeafItem>
  ))

  return (
    <>
    <List className="nodrag">
      {renderTree(tree)}
    </List>
    </>
  )  
};

export default TreeView;
