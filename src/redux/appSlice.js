import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { getConfig } from '../apis/configApi';
import { mpdDatabase, mpdStatus } from '../apis/mpdApi';
import listener, { EVENTS } from '../utils/listener';
import storage, { STORAGE } from '../utils/storage';
const capitalize = string => string.replace(/([a-z])/i, (str, firstLetter) => firstLetter.toUpperCase())

export const staty = (args) => Object.fromEntries(args.map(arg => [`set${capitalize(arg)}`, (state, action) => {state[arg] = action.payload; return state}]))

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
  error: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setTree, setFullTree, setAudioUrl, setPlayIndex, setRadios, setCanvasIndex, setMpdMode, setMpdStatus, setMpdPool, setError, setConfig } = appSlice.actions

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

export const useApp = () => {
    const dispatch = useDispatch();

    return {
      setError: value => dispatch(updateError(value)),
      setMpdMode: value => dispatch(toggleMpdMode(value)),
      setMpdStatus: value => dispatch(setMpdStatus(value)),
      getFullTree: value => dispatch(getFullTree),
      setPlayIndex: value => dispatch(setPlayIndex(value)),
      setRadios: item => dispatch(setRadios(item)),
      addToPlaylist: item => dispatch(addToPlaylist(item)),
      nextIndex: () => dispatch(nextIndex()),
      getConfig: async () => {
        const data = await getConfig()
        const actualServer = data.servers.find(i => i.default === true)

        if (actualServer) {
          if (actualServer.internal === true) {
            dispatch(setAudioUrl(`${process.env.REACT_APP_API}/mp3`))
          } else if (actualServer.audioUrl) {
            dispatch(setAudioUrl(actualServer.audioUrl))
          } else {
            dispatch(setAudioUrl(null))
          }
        }

        dispatch(setConfig(data))
      },
      getMpdPool: async () => {
        const { data } = await mpdDatabase()
        dispatch(setMpdPool(data))
      },
      resetCanvas: () => dispatch(resetCanvas())
    }
}