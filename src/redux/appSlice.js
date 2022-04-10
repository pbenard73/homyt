import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { getConfig } from '../api';
const capitalize = string => string.replace(/([a-z])/i, (str, firstLetter) => firstLetter.toUpperCase())

export const staty = (args) => Object.fromEntries(args.map(arg => [`set${capitalize(arg)}`, (state, action) => {state[arg] = action.payload; return state}]))

const initialState = {
  tree: null,
  fullTree: null,
  playlist: [],
  playIndex: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setTree, setFullTree, setPlaylist, setPlayIndex } = appSlice.actions

export default appSlice.reducer

const addToPlaylist = (item) => (dispatch, getState) => {
  const playlist = getState().app.playlist

  dispatch(setPlaylist([...playlist, item]))
}

const nextIndex = (dispatch, getState) => {
  const index = getState().app.playIndex

  dispatch(setPlayIndex(index + 1))
}

export const useApp = () => {
    const dispatch = useDispatch();

    return {
       setPlayIndex: value => dispatch(setPlayIndex(value)),
        setPlaylist: value => dispatch(setPlaylist(value)),
        addToPlaylist: item => dispatch(addToPlaylist(item)),
        nextIndex: () => dispatch(nextIndex()),
        getFullTree: async () => {
          const tree = await getConfig()
          dispatch(setFullTree(tree))
        }
    }
}