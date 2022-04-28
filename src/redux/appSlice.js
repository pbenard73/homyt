import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { getConfig, mpdDatabase, mpdStatus } from '../api';
import listener, { EVENTS } from '../utils/listener';
import storage, { STORAGE } from '../utils/storage';
const capitalize = string => string.replace(/([a-z])/i, (str, firstLetter) => firstLetter.toUpperCase())

export const staty = (args) => Object.fromEntries(args.map(arg => [`set${capitalize(arg)}`, (state, action) => {state[arg] = action.payload; return state}]))

const initialState = {
  tree: null,
  fullTree: null,
  playlist: [],
  playIndex: null,
  radios: [],
  canvasIndex: 0,
  mpdMode: false,
  mpdStatus: {},
  mpdPool: []
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setTree, setFullTree, setPlaylist, setPlayIndex, setRadios, setCanvasIndex, setMpdMode, setMpdStatus, setMpdPool } = appSlice.actions

export default appSlice.reducer

const addToPlaylist = (item) => (dispatch, getState) => {
  const playlist = getState().app.playlist
  const newPlaylist = [...playlist, item]
  dispatch(setPlaylist(newPlaylist))
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

export const useApp = () => {
    const dispatch = useDispatch();

    return {
      setMpdMode: value => dispatch(toggleMpdMode(value)),
      setMpdStatus: value => dispatch(setMpdStatus(value)),
      setFullTree: value => dispatch(setFullTree(value)),
      setPlayIndex: value => dispatch(setPlayIndex(value)),
      setPlaylist: value => {
        dispatch(setPlaylist(value))
        listener.dispatch(EVENTS.PLAYLIST_CHANGE, value)
      },
      setRadios: item => dispatch(setRadios(item)),
      addToPlaylist: item => dispatch(addToPlaylist(item)),
      nextIndex: () => dispatch(nextIndex()),
      getFullTree: async () => {
        const {files: tree, radios} = await getConfig()
        dispatch(setFullTree(tree))
        dispatch(setRadios(radios))
      },
      getMpdPool: async () => {
        const { data } = await mpdDatabase()
        dispatch(setMpdPool(data))
      },
      resetCanvas: () => dispatch(resetCanvas())
    }
}