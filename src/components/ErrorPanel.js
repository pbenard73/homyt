import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components'

const ErrorWrapper = styled.div`
  position: fixed;
  background: red;
  top:0;
  left:0;
  right:0;
`

const ErrorPanel = () => {
  const error = useSelector(state => state.app.error)

  return error && <ErrorWrapper>ERROR</ErrorWrapper>
}

export default ErrorPanel;
