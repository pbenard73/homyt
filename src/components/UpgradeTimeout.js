import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'

const ErrorWrapper = styled.div`
  position: fixed;
  background: green;
  color: white;
  top:0;
  left:0;
  right:0;
`

const UpgradePanel = () => {
  const upgrading = useSelector(state => state.app.upgrading)

  return upgrading && <ErrorWrapper>Server restarting...</ErrorWrapper>
}

export default UpgradePanel;
