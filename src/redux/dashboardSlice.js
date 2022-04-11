import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import Browser from '../windows/Browser'
import Downloader from '../windows/Downloader'
import Playlist from '../windows/Playlist'
import Radio from '../windows/Radio'
import SpectrumConfig from '../windows/SpectrumConfig'
import { staty } from './appSlice'

export const WINDOWS = {
  BROWSER: 'browser',
  DOWNLOADER: 'downloader',
  SPECTRUM: 'spectrum',
  RADIO: 'radio',
  PLAYLIST: 'playlist'
}

const windowsList = {
  [WINDOWS.BROWSER]: {
    uuid: WINDOWS.BROWSER,
    title: 'Browser',
    component: <Browser />
  },
  [WINDOWS.RADIO]: {
    uuid: WINDOWS.RADIO,
    title: 'Radio',
    component: <Radio />
  },
  [WINDOWS.PLAYLIST]: {
    uuid: WINDOWS.PLAYLIST,
    title: 'Playlist',
    component: <Playlist />,
    options: {
      size:[400, 400],
    }
  },
  [WINDOWS.DOWNLOADER]: {
    uuid: WINDOWS.DOWNLOADER,
    title: 'Downloader',
    component: <Downloader />,
    center:true,
    options: {
      size:[600, 400],
    }
  },
  [WINDOWS.SPECTRUM]: {
    uuid: WINDOWS.SPECTRUM,
    title: 'Spectrum',
    component: <SpectrumConfig />
  }
}

const initialState = {
  windows: {},
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setWindows } = dashboardSlice.actions

export default dashboardSlice.reducer

const showWindow = windowUuid => (dispatch, getState) => {
  const { dashboard } = getState()
  const windows = {...dashboard.windows}

  if (windows[windowUuid] !== undefined || windowsList[windowUuid] === undefined) {
    return
  }

  windows[windowUuid] = {...windowsList[windowUuid]}

  dispatch(setWindows(windows))
}

const removeWindow = windowUuid => (dispatch, getState) => {
  const { dashboard } = getState()
  const windows = {...dashboard.windows}

  if (windows[windowUuid] === undefined ) {
    return
  }

  windows[windowUuid] = undefined
  delete windows[windowUuid]

  dispatch(setWindows(windows))
}


export const useDashboard = () => {
    const dispatch = useDispatch();

    return {
      showWindow: windowUuid => dispatch(showWindow(windowUuid)),
      removeWindow: windowUuid => dispatch(removeWindow(windowUuid))
    }
}