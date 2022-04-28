import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { login, logout, refreshSession } from '../api'
import { staty } from './appSlice'
import { toast } from 'react-toastify';

const initialState = {
  user: null,
}

export const dashboardSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    ...staty(Object.keys(initialState))
  },
})

export const { setUser } = dashboardSlice.actions

export default dashboardSlice.reducer

const loginAction = (t, username, password) => async (dispatch, getState) => {
  const data = await login({}, {username, password});

  if (data.valid === true) {
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
    dispatch(setUser(data.user))
  }
}

const logoutAction = async dispatch => {
  const data = await logout()

  if (data.valid === true) {
    dispatch(setUser(null))
  }
}


export const useAuth = () => {
    const dispatch = useDispatch();

    return {
      login: (t, username, password) => dispatch(loginAction(t, username, password)),
      logout: () => dispatch(logoutAction),
      refreshSession: () => dispatch(refreshAction)
    }
}