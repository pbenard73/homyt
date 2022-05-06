import { makeApi } from "react-axios-api";

const pool = {
  getConfig: { path:"/" },
  addServer: { path:"/server", method: "post" },
  deleteServer: { path:"/server/:index", method: "delete" },
  setDefaultServer: { path:"/setDefaultServer", method: "put" },
};

export const { getConfig, addServer, setDefaultServer, deleteServer } = makeApi(pool, `${process.env.REACT_APP_API}/config`);
