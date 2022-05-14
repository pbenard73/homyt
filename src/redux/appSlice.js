import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { getConfig } from '../apis/configApi';
import { mpdDatabase, mpdListPlaylists, mpdStatus, mpdUpdate } from '../apis/mpdApi';
import listener, { EVENTS } from '../utils/listener';
import storage, { STORAGE } from '../utils/storage';
import { useDashboard, WINDOWS } from './dashboardSlice';
const capitalize = string => string.replace(/([a-z])/i, (str, firstLetter) => firstLetter.toUpperCase())

export const staty = (args) => Object.fromEntries(args.map(arg => [`set${capitalize(arg)}`, (state, action) => {state[arg] = action.payload; return state}]))

export const RADIO_PLAYLIST_NAME = "[Radio Streams]"

const initialState = {
  audioUrl: null,
  tree: null,
  config: [],
  fullTree: null,
  playIndex: null,
  radios: [],
  canvasIndex: 0,
  mpdMode: false,
  mpdStatus: {},
  mpdPool: [],
  playlists: [],
  volume: 1,
  error: null,
  searchDownload: null,
  upgrading: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { 
  setTree, 
  setFullTree,
  setAudioUrl,
  setPlayIndex, 
  setRadios, 
  setCanvasIndex,
  setMpdMode,
  setMpdStatus, 
  setMpdPool, 
  etError,
  setConfig, 
  setPlaylists, 
  setSearchDownload,
  setVolume,
  setError,
  setUpgrading
} = appSlice.actions

export default appSlice.reducer

const addToPlaylist = (item) => (dispatch, getState) => {
  const playlist = getState().app.playlist
  const newPlaylist = [...playlist, item]
  listener.dispatch(EVENTS.PLAYLIST_CHANGE, newPlaylist)
  if (newPlaylist.length === 1) {
    listener.dispatch(EVENTS.ACTION_PLAY_SONG, {...item, index: 0});
  }
}

const nextIndex = () => (dispatch, getState) => {
  const index = getState().app.playIndex  
  listener.dispatch(EVENTS.PLAYLIST_INDEX, index + 1)
  dispatch(setPlayIndex(index + 1))
}

const resetCanvas = () => (dispatch, getState) => {
  const canvasIndex = getState().app.canvasIndex  
  dispatch(setCanvasIndex(canvasIndex + 1))
}

const toggleMpdMode = value => async (dispatch, getState) => {
  if (value === false) {
    setMpdStatus({})
  } else {      
    const [{ data: mpdPool }, {data: status}] = await Promise.all([
      mpdDatabase(),
      mpdStatus()
    ]);

    dispatch(setMpdPool(mpdPool))
    dispatch(setMpdStatus(status))
  }

  storage.set(STORAGE.MPD_MODE, value === true ? 1 : 0)

  dispatch(setMpdMode(value))
}

const updateError = value => (dispatch, getState) => {
  const state = getState();

  if (JSON.stringify(value) !== JSON.stringify(state.app.error)) {
    dispatch(setError(value))
    if (value !== null) {
      dispatch(setMpdStatus({}))
    }
  }
}

const getFullTree = async dispatch => {
  const { data: pool } = await mpdDatabase();

  dispatch(setMpdPool(pool))
}

const getMpdDatabase = async (dispatch, refresh = false) => {
  const result = await mpdDatabase({}, {refresh})
  dispatch(setMpdPool(result.valid === true ? result.data : []))
}

const getMpdConfig = async (dispatch, getState) => {
  const state = getState();
  const stateConfig = state.app.config?.servers || [];
  const actualStateServerIndex = stateConfig.findIndex(i => i.default === true)


  const data = await getConfig()
  const actualServer = data.servers.find(i => i.default === true)
  const actualServerIndex = data.servers.findIndex(i => i.default === true)

  if (actualServer) {
    if (actualServer.audioUrl) {
      dispatch(setAudioUrl(actualServer.audioUrl))
    } else if (actualServer.internal === true) {
      dispatch(setAudioUrl(`${process.env.REACT_APP_API}/mp3`))
    } else  {
      dispatch(setAudioUrl(null))
    }
  }

  if (actualServerIndex !== actualStateServerIndex) {
    await getMpdDatabase(dispatch, true)
    await mpdStatus()
    dispatch(getPlaylists(true))
  }

  dispatch(setConfig(data))
}

const getPlaylists = force => async dispatch => {
  let {valid, data: dbPlaylists} = await mpdListPlaylists({}, {force});

  if (valid === true) {
    dispatch(setPlaylists(dbPlaylists))
  }
}


export const useApp = () => {
    const dispatch = useDispatch();
    const dashboard = useDashboard()

    return {
      setError: value => dispatch(updateError(value)),
      setMpdMode: value => dispatch(toggleMpdMode(value)),
      setMpdStatus: value => dispatch(setMpdStatus(value)),
      getFullTree: value => dispatch(getFullTree),
      setPlayIndex: value => dispatch(setPlayIndex(value)),
      setRadios: item => dispatch(setRadios(item)),
      addToPlaylist: item => dispatch(addToPlaylist(item)),
      nextIndex: () => dispatch(nextIndex()),
      willUpgrade: () => dispatch(setUpgrading(true)),
      getConfig: () => dispatch(getMpdConfig),
      getPlaylists: force => dispatch(getPlaylists(force)),
      eraseSearchDownload: () => dispatch(setSearchDownload(null)),
      update: async () => {
        await mpdUpdate();
        await getMpdDatabase(dispatch, true)
      },
      getMpdPool: async (refresh = false) => {
        await getMpdDatabase(dispatch, refresh)
      },
      resetCanvas: () => dispatch(resetCanvas()),
      downloadActual: value => {
        dispatch(setSearchDownload(value))
        dashboard.showWindow(WINDOWS.DOWNLOADER)
      },
      setVolume: volume => {
        dispatch(setVolume(volume));
        document.getElementById('casper_video').volume = volume;
      }
    }
}