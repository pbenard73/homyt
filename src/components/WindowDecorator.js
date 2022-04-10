import React, {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components'

const SyledWindow = styled.div`
  height:100%;
  backdrop-filter: blur(10px);
  > .window_content{
    background-color: #00000085 !important;
    overflow:auto;
    color:white;
  }
`

const WindowDecorator = ({style,toggle, onClose, data,resizable, children}) => (
  <SyledWindow className='window' style={{style}}>
    <div className='decorator'>
        <span className='title'>{data.title}</span>
        {resizable === false ? null : (
      <span className='decorator_toggle nodrag' onClick={toggle}></span>
        )}
        <span className='decorator_close nodrag' onClick={onClose}></span>
    </div>
    <div className='window_content'>{children}</div>
  </SyledWindow>
)

export default WindowDecorator