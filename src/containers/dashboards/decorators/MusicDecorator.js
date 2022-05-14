import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close';

const SyledWindow = styled.div`
  height:100%;
  backdrop-filter: blur(10px);
  > .window_content{
    background-color: rgba(58, 58, 58, 0.66) !important;
    overflow:auto;
    color:white;
  }
  > .decorator {
    background: rgba(0, 0, 0, 0.7) !important;
    padding:0;
    cursor:grab;
    .decorator_close{
      background: red;
      height:20px;
      width: 20px;
      &:before, &:after{
        content: none !important;
      }
      svg{
        transition: transform .6s ease;
        transform: rotate(0deg)
      }
      &:hover svg{
        transform: rotate(90deg)
      }
    }
    span.title{
      margin-left:auto;
    }
  }
`

const MusicDecorator = ({style,toggle, onClose, data,resizable, children}) => {
  const { t } = useTranslation()

  return (
    <SyledWindow className='window' style={{style}}>
      <div className='decorator'>
          <span className='title'>{t(data.title)}</span>
          {resizable === false ? null : (
        <span className='decorator_toggle nodrag' onClick={toggle}></span>
          )}
          <span className='decorator_close nodrag' onClick={onClose}><CloseIcon style={{height:"20px", width:'20px'}}/></span>
      </div>
      <div className='window_content'>{children}</div>
    </SyledWindow>
  )
}

export default MusicDecorator