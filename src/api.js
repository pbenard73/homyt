import { makeApi } from "react-axios-api";

const pool = {
  search: { path: "/search/:query", method: "post" },
  addradio: { path: "/addradio", method: "post" },
  download: { path: "/download", method: "post" },
  readdir: { path: "/readdir", method:"post" },
  deleteFile: {path: "/deleteFile", method:"delete"},
  moveFile: {path: "/moveFile", method:"post"},
  listen: {path:"/listen"},
  getclients: {path:"/clients"},
  softwareUpdate: {path:"/update", method: "post"},
  softwareInstall: {path:"/auth/install", method: "post"},
  setTheme: {path:"/theme", method: "put"}
};

export const { 
  download, search, readdir, deleteFile, moveFile, listen, addradio, getclients,
  softwareUpdate, softwareInstall,
  setTheme
} = makeApi(pool, process.env.REACT_APP_API);
