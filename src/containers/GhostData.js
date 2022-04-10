import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {AwesomeButton} from "react-awesome-button";
import { useApp } from "../redux/appSlice";
import { Windows } from 'react-windows-dashboard'
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";



function GhostData() {
  const app = useApp()

  useEffect(() => {
    app.getFullTree()
  }, [])

  return (
    <span></span>
  )

}

export default GhostData;
