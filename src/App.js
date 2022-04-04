import React, { useState } from "react";
import { getConfig } from "./api";
import Menu from "./Menu";
import Download from "./Downloader";
import styled from "styled-components";

const Folder = styled.div`
  color: white;
  color: white;
  padding: 20px 10px;
  background: rgb(0 0 0 / 53%);
  backdrop-filter: blur(7px);
  margin-bottom: 50px;
`;

function App() {
  const [menu, setMenu] = useState(false);
  const [openLeaf, setOpenLeaf] = useState([]);
  const [folder, setFolder] = useState(null);
  const { isCalling, data: tree, error } = getConfig.useHook();

  const toggleMenu = () => setMenu(!menu);

  const getContent = () => {
    if (isCalling === true) {
      return <>Is Calling config</>;
    }

    if (error) {
      return <>An error occured</>;
    }

    return (
      <div>
        {menu && (
          <Menu
            onClose={toggleMenu}
            tree={tree}
            folder={folder}
            setFolder={setFolder}
            open={openLeaf}
            setOpen={setOpenLeaf}
          />
        )}
        {folder && <Download folder={folder} />}
      </div>
    );
  };

  return (
    <div className="App">
      <Folder onClick={toggleMenu}>
        Download Folder:
        <div>{folder?.path}</div>
      </Folder>
      {getContent()}
    </div>
  );
}

export default App;
