import React from "react";
import { Drawer, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import styled from "styled-components";

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

const Drawy = styled(Drawer)`
  .MuiPaper-root {
    background-color: rgb(8 8 8 / 64%);
    backdrop-filter: blur(4px);
    color: white;
  }
`;

const Menu = ({ tree, open, setOpen, onClose, folder, setFolder }) => {
  const toggleLeaf = (leafPath) => {
    if (open.indexOf(leafPath) === -1) {
      return setOpen((o) => [...o, leafPath]);
    }

    return setOpen((o) => o.filter((i) => i !== leafPath));
  };

  const getLeaf = (obj) => (
    <LeafItem>
      <ListItemText
        primary={obj.name}
        style={folder?.path !== obj.path ? {} : { color: "red" }}
        onClick={() => toggleLeaf(obj.path)}
      />
      <ListItemSecondaryAction>
        <IconButton
          style={{ color: folder?.path !== obj.path ? "white" : "red", marginLeft: "auto" }}
          onClick={() => {
            setFolder(obj);
            onClose();
          }}
        >
          <DoneOutlineIcon />
        </IconButton>
      </ListItemSecondaryAction>

      {obj.children.length > 0 && open.indexOf(obj.path) !== -1 && (
        <div className="children_leaf">
          <List>{obj.children.map((i) => getLeaf(i))}</List>
        </div>
      )}
    </LeafItem>
  );

  return (
    <Drawy open anchor="left" onClose={onClose}>
      <List>{tree.map((i) => getLeaf(i))}</List>
    </Drawy>
  );
};

export default Menu;
