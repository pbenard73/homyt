import React, { useState } from "react";
import { IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styled from "styled-components";
import { deleteFile } from "./api";
import { useApp } from "./redux/appSlice";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { mpdAdd } from "./apis/mpdApi";


const LeafItem = styled(ListItem)`
  flex-direction: column;
  align-items: start !important;
  .MuiListItemSecondaryAction-root {
    top: 26px;
  }
  .children_leaf {
    width: 100%;
  }
`;

const TreeView = ({ tree }) => {
  const [open, setOpen] = useState([])
  const app = useApp()

  const toggle = (leafPath) => {
    const newOpen = [...open]

    if (newOpen.indexOf(leafPath) !== -1) {
      return setOpen(o => o.filter(i => i !== leafPath))
    }

    setOpen(o => [...o, leafPath])
  }

  // const deleteFileAction = async (filePath) => {
  //   const result = await deleteFile({}, {file: filePath})

  //   if (result.valid === true) {
  //     return refresh?.()
  //   }
  // }

  // const addAllFolder = leaf => {
  //   const loop = obj => {
  //     if (obj.children === undefined) {
  //       return app.addToPlaylist(obj)
  //     }

  //     obj.children.forEach(i => loop(i))
  //   }

  //   loop(leaf)
  // }

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
        <ListItemIcon style={{color:'white', alignItems:'center'}}>
          <FolderIcon />
        </ListItemIcon>
      )}
      <ListItemText primary={renderName(leaf, parentName)} style={{color:'white'}} onClick={files === true ? undefined : () => toggle(leaf.directory)}/>
      </div>
      <ListItemSecondaryAction>
        <>
          <IconButton onClick={() => {
            mpdAdd({}, {path: files === true ? leaf.file : leaf.directory})
          }}>
            <PlayArrow />
          </IconButton>
        </>
      </ListItemSecondaryAction>
      {files === false && (
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
    <List className="nodrag" style={{maxHeight:'75vh', overflow:'auto'}}>
      {renderTree(tree)}
    </List>
    </>
  )  
};

export default TreeView;
