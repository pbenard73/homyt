import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { addradio, getConfig } from '../api';
import listener, { EVENTS } from '../utils/listener';
const capitalize = string => string.replace(/([a-z])/i, (str, firstLetter) => firstLetter.toUpperCase())

export const staty = (args) => Object.fromEntries(args.map(arg => [`set${capitalize(arg)}`, (state, action) => {state[arg] = action.payload; return state}]))

const initialState = {
  tree: null,
  fullTree: null,
  playlist: [],
  playIndex: null,
  radios: []
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setTree, setFullTree, setPlaylist, setPlayIndex, setRadios } = appSlice.actions

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

export const useApp = () => {
    const dispatch = useDispatch();

    return {
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
        }
    }
}