import { makeApi } from "react-axios-api";

const pool = {
  mpdVolume: {path:"/setVolume", method:"put"},
  mpdVolumeUp: {path:"/setVolumeUp", method:"put"},
  mpdVolumeDown: {path:"/setVolumeDown", method:"put"},
  mpdNext: {path:"/next", method:"put"},
  mpdPrevious: {path:"/previous", method:"put"},
  mpdStatus: {path:"/getStatus", method:"put"},
  mpdPause: {path:"/pause", method:"put"},
  mpdPlay: {path:"/play", method:"put"},
  mpdShuffle: {path:"/shuffle", method:"put"},
  mpdRepeat: {path:"/repeat", method:"put"},
  mpdRandom: {path:"/random", method:"put"},
  mpdDatabase: {path:"/database", method:"put"},
  mpdAdd: {path:"/add", method:"put"},
  mpdSeek: {path:"/seek", method:"put"},
};

export const { 
  mpdVolume,
  mpdVolumeUp, 
  mpdVolumeDown, 
  mpdNext, 
  mpdPrevious, 
  mpdStatus, 
  mpdPause, 
  mpdPlay, 
  mpdShuffle, 
  mpdRepeat, 
  mpdRandom, 
  mpdDatabase, 
  mpdAdd,
  mpdSeek
 } = makeApi(pool, `${process.env.REACT_APP_API}/mpd`);
