import React from "react";
import { Windows } from 'react-windows-dashboard'
import { useSelector } from "react-redux";
import { useDashboard } from "../redux/dashboardSlice";
import themes, { defaultTheme, THEMES } from "../data/theme";

function Main() {
  const windows = useSelector(state => state.dashboard.windows)
  const userTheme = useSelector(state => state.auth.user?.theme)
  const dashboard = useDashboard()
  
  const {dashboard: Dashboard, decorator: Decorator} = themes[userTheme || defaultTheme]
  

  return (
    <Windows dashboard={<Dashboard />} decorator={Decorator} windows={windows} onClose={dashboard.removeWindow}/>
  )
}

export default Main;
