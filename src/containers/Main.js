import React from "react";
import { Windows } from 'react-windows-dashboard'
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
import { useDashboard } from "../redux/dashboardSlice";
import WindowDecorator from "../components/WindowDecorator";

function Main() {
  const windows = useSelector(state => state.dashboard.windows)
  const dashboard = useDashboard()
  
  return (
    <Windows dashboard={<Dashboard />} decorator={WindowDecorator} windows={windows} onClose={dashboard.removeWindow}/>
  )
}

export default Main;
