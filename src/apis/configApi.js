import { makeApi } from "react-axios-api";

const pool = {
  getConfig: { path:"/" },
  addServer: { path:"/server", method: "post" },
  setDefaultServer: { path:"/setDefaultServer", method: "put" },
};

export const { getConfig, addServer, setDefaultServer } = makeApi(pool, `${process.env.REACT_APP_API}/config`);
