import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'

const ErrorPanel = () => {
  const error = useSelector(state => state.app.error)

  return error && (
    <div style={{position:'fixed', background: 'red', top:0, left:0, right:0}}>ERROR</div>
  )
}

export default ErrorPanel;
