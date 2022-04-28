import { configureStore } from '@reduxjs/toolkit'
import app from './appSlice'
import auth from './authSlice'
import visualizer from './visualizerSlice'
import dashboard from './dashboardSlice'

export const store = configureStore({
  reducer: {app, auth, dashboard, visualizer},
})