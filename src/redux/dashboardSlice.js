import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import Browser from '../windows/Browser'
import Config from '../windows/Config'
import Downloader from '../windows/Downloader'
import Playlist from '../windows/Playlist'
import Radio from '../windows/Radio'
import Remote from '../windows/Remote'
import SpectrumConfig from '../windows/SpectrumConfig'
import { staty } from './appSlice'

export const WINDOWS = {
  BROWSER: 'browser',
  DOWNLOADER: 'downloader',
  SPECTRUM: 'spectrum',
  RADIO: 'radio',
  CONFIG: 'config',
  REMOTE: 'remote',
  PLAYLIST: 'playlist'
}

const windowsList = {
  [WINDOWS.REMOTE]: {
    uuid: WINDOWS.REMOTE,
    title: 'window_remote',
    component: <Remote />
  },
  [WINDOWS.BROWSER]: {
    uuid: WINDOWS.BROWSER,
    title: 'window_browser',
    component: <Browser />
  },
  [WINDOWS.RADIO]: {
    uuid: WINDOWS.RADIO,
    title: 'window_radios',
    component: <Radio />
  },
  [WINDOWS.PLAYLIST]: {
    uuid: WINDOWS.PLAYLIST,
    title: 'window_playlist',
    component: <Playlist />,
    options: {
      size:[400, 400],
    }
  },
  [WINDOWS.DOWNLOADER]: {
    uuid: WINDOWS.DOWNLOADER,
    title: 'window_downloader',
    component: <Downloader />,
    center:true,
    options: {
      size:[600, 400],
    }
  },
  [WINDOWS.SPECTRUM]: {
    uuid: WINDOWS.SPECTRUM,
    title: 'window_spectrum',
    component: <SpectrumConfig />
  },
  [WINDOWS.CONFIG]: {
    uuid: WINDOWS.CONFIG,
    title: 'window_config',
    component: <Config />
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