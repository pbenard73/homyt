import { makeApi } from "react-axios-api";

const pool = {
  login: { path:"/auth/login", method: "post" },
  logout: { path:"/auth/logout" },
  refreshSession: { path:"/auth/refresh" },
  search: { path: "/search/:query", method: "post" },
  addradio: { path: "/addradio", method: "post" },
  download: { path: "/download", method: "post" },
  getConfig: { path: "/config" },
  readdir: { path: "/readdir", method:"post" },
  deleteFile: {path: "/deleteFile", method:"delete"},
  moveFile: {path: "/moveFile", method:"post"},
  listen: {path:"/listen"},
  getclients: {path:"/clients"},
  mpdVolumeUp: {path:"/mpd/setVolumeUp", method:"put"},
  mpdVolumeDown: {path:"/mpd/setVolumeDown", method:"put"},
  mpdNext: {path:"/mpd/next", method:"put"},
  mpdPrevious: {path:"/mpd/previous", method:"put"},
  mpdStatus: {path:"/mpd/getStatus", method:"put"},
  mpdPause: {path:"/mpd/pause", method:"put"},
  mpdPlay: {path:"/mpd/play", method:"put"},
  mpdShuffle: {path:"/mpd/shuffle", method:"put"},
  mpdRepeat: {path:"/mpd/repeat", method:"put"},
  mpdRandom: {path:"/mpd/random", method:"put"},
  mpdDatabase: {path:"/mpd/database", method:"put"},
  mpdAdd: {path:"/mpd/add", method:"put"},
  softwareUpdate: {path:"/update", method: "post"},
  softwareInstall: {path:"/auth/install", method: "post"}
};

export const { 
  getConfig, download, search, readdir, deleteFile, moveFile, listen, addradio, getclients,
  mpdVolumeUp, mpdVolumeDown, mpdNext, mpdPrevious, mpdStatus, mpdPause, mpdPlay, mpdShuffle, mpdRepeat, mpdRandom, mpdDatabase, mpdAdd,
  login, logout, refreshSession,
  softwareUpdate, softwareInstall
} = makeApi(pool, process.env.REACT_APP_API);
