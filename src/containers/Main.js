import React from "react";
import { Windows } from 'react-windows-dashboard'
import { useSelector } from "react-redux";
import { useDashboard } from "../redux/dashboardSlice";
import themes, { defaultTheme } from "../data/theme";

function Main() {
  const windows = useSelector(state => state.dashboard.windows)
  const windowsOrder = useSelector(state => state.dashboard.order)
  const userTheme = useSelector(state => state.auth.user?.theme)
  const dashboard = useDashboard()
  
  const {dashboard: Dashboard, decorator: Decorator} = themes[userTheme || defaultTheme]
  
  return (
    <Windows 
      dashboard={<Dashboard />} 
      decorator={Decorator} 
      windows={windows}
      order={windowsOrder}
      active={windowsOrder.length === 0 ? null : windowsOrder[windowsOrder.length - 1]}
      setActive={dashboard.setActive}
      onClose={dashboard.removeWindow}
    />
  )
}

export default Main;
