import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import spectrum from '../utils/spectrum'
import { VISUALIZER } from '../visualizers'
import { staty } from './appSlice'

const initialState = {
  canvas: null,
  spectrum: VISUALIZER.LINE,
}

export const visualizerSlice = createSlice({
  name: 'visualizer',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState)),
    setSpectrum: (state, action) => {
      state.spectrum = action.payload
      spectrum.setRenderer(action.payload)
      return state
    }
  },
})

export const { setCanvas, setSpectrum } = visualizerSlice.actions

export default visualizerSlice.reducer


export const useVisualizer = () => {
    const dispatch = useDispatch();

    return {
      setCanvas: value => dispatch(setCanvas(value)),
      setSpectrum: value => dispatch(setSpectrum(value))
    }
}