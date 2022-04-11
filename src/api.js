import { makeApi } from "react-axios-api";

const pool = {
  search: { path: "/search/:query", method: "post" },
  addradio: { path: "/addradio", method: "post" },
  download: { path: "/download", method: "post" },
  getConfig: { path: "/config" },
  readdir: { path: "/readdir", method:"post" },
  deleteFile: {path: "/deleteFile", method:"delete"},
  moveFile: {path: "/moveFile", method:"post"},
  listen: {path:"/listen"}
};

export const { getConfig, download, search, readdir, deleteFile, moveFile, listen, addradio } = makeApi(pool, process.env.REACT_APP_API);
