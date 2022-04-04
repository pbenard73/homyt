import React from "react";
import { Drawer, IconButton } from "@mui/material";
import styled from "styled-components";

const Drawy = styled(Drawer)`
  .MuiPaper-root {
    background-color: rgb(8 8 8 / 64%);
    backdrop-filter: blur(4px);
    color: white;

    details {
      font-size: 22px;
      margin-bottom: 20px;
      summary {
        display: flex;
        align-items: center;
      }
    }
  }
`;

const Menu = ({ tree, onClose, folder, setFolder }) => {
  const getLeaf = (obj) => (
    <details>
      <summary style={folder?.path !== obj.path ? {} : { color: "red" }}>
        {obj.name}
        <IconButton
          style={{ color: "white", marginLeft: "auto" }}
          onClick={() => {
            setFolder(obj);
            onClose();
          }}
        >
          S
        </IconButton>
      </summary>
      {obj.children.map((i) => getLeaf(i))}
    </details>
  );

  return (
    <Drawy open anchor="left" onClose={onClose}>
      {tree.map((i) => getLeaf(i))}
    </Drawy>
  );
};

export default Menu;
