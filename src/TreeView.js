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

const TreeView = ({ setFolder, select, setPlaylist, mode, tree, refresh, copyFile, setCopyFile, copyAction }) => {
  const [open, setOpen] = useState([])
  const app = useApp()

  const toggle = (leafPath) => {
    const newOpen = [...open]

    if (newOpen.indexOf(leafPath) !== -1) {
      return setOpen(o => o.filter(i => i !== leafPath))
    }

    setOpen(o => [...o, leafPath])
  }

  const deleteFileAction = async (filePath) => {
    const result = await deleteFile({}, {file: filePath})

    if (result.valid === true) {
      return refresh?.()
    }
  }

  const addAllFolder = leaf => {
    const loop = obj => {
      if (obj.children === undefined) {
        return app.addToPlaylist(obj)
      }

      obj.children.forEach(i => loop(i))
    }

    loop(leaf)
  }

  const renderTree = children => children.filter(i => setFolder !== undefined ? Array.isArray(i.children) : i).map(leaf => (
    <LeafItem key={leaf.path}>
      <div style={{flexDirection:'row', display:'flex'}}>

      {Array.isArray(leaf.children) === true && (
        <ListItemIcon style={{color:'white', alignItems:'center'}}>
          <FolderIcon />
        </ListItemIcon>
      )}
      <ListItemText primary={leaf.name} style={{color:'white'}} onClick={() => toggle(leaf.path)}/>
      </div>
      <ListItemSecondaryAction>
        <>
          {setFolder !== undefined && (
            <IconButton onClick={() => setFolder(leaf)} style={{color:'white'}}>
              S
            </IconButton>
          )}
          {}
          {select !== true && leaf.children === undefined ? (
            <>
          
            <IconButton onClick={() => app.addToPlaylist(leaf)} style={{color:'white'}}>
              <AddCircleOutlineIcon />
            </IconButton>
            {/* <IconButton onClick={() => setCopyFile(leaf.path)} style={{color: copyFile === leaf.path ? 'red' : 'white'}}>
              <FileCopyIcon />
            </IconButton> */}
            <IconButton onClick={() => deleteFileAction(leaf.path)} style={{color:'white'}}>
              <DeleteIcon />
            </IconButton>
            </>
          ) : (
            <IconButton onClick={() => addAllFolder(leaf)} style={{color:'white'}}>
              <AddCircleIcon />
            </IconButton>
          )}
          {select !== true && leaf.children !== undefined && copyFile !== null && (
            <>
            <IconButton onClick={() => copyAction(leaf.path)} style={{color: 'white'}}>
              <ContentPasteIcon />
            </IconButton>
            </>
          )}
        </>
      </ListItemSecondaryAction>
      {Array.isArray(leaf.children) === true && open.indexOf(leaf.path) !== -1 && (
       <div className="children_leaf">
         <List>
           {renderTree(leaf.children)}
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
