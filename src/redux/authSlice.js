import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { setTheme } from '../api'
import { staty } from './appSlice'
import { toast } from 'react-toastify';
import { defaultTheme } from '../data/theme';
import { login, logout, refreshSession, softwareInstall } from '../apis/authApi';

const initialState = {
  user: null,
  install: false
}

export const dashboardSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setUser, setInstall } = dashboardSlice.actions

export default dashboardSlice.reducer

const loginAction = (t, username, password) => async (dispatch, getState) => {
  const state = getState();
  const action = state.auth.install === false ? login : softwareInstall

  const data = await action({}, {username, password});

  if (data.valid === true) {
    dispatch(setInstall(false))
    if (!data.user.theme) {
      data.user.theme = defaultTheme;
    }
    return dispatch(setUser(data.user))
  }

  toast(t('bad_credentials'), {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

const refreshAction = async dispatch => {
  const data = await refreshSession();

  if (data.valid === true) {
    if (!data.user.theme) {
      data.user.theme = defaultTheme;
    }
    dispatch(setUser(data.user))
  }
  
  if (data.install) {
    dispatch(setInstall(data.install))
  }
}

const logoutAction = async dispatch => {
  const data = await logout()

  if (data.valid === true) {
    dispatch(setUser(null))
  }
}

const setUserTheme = themeValue => async (dispatch, getState) => {
  const result = await setTheme({}, {theme: themeValue});

  if (result.valid === true) {
    const state = getState();
    const user = { ...state.auth.user}
    user.theme = themeValue;

    dispatch(setUser(user))
  }
}

const updateUserSettings = (field, value) => (dispatch, getState) => {
  const state = getState()
  const user = {...state.auth.user};

  user.settings = {...user.settings, [field]: value};

  dispatch(setUser(user));
}

export const useAuth = () => {
    const dispatch = useDispatch();

    return {
      login: (t, username, password) => dispatch(loginAction(t, username, password)),
      logout: () => dispatch(logoutAction),
      refreshSession: () => dispatch(refreshAction),
      setTheme: theme => dispatch(setUserTheme(theme)),
      updateUserSettings: (field, value) => dispatch(updateUserSettings(field, value))
    }
}