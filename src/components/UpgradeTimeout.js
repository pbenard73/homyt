import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components'

const ErrorWrapper = styled.div`
  position: fixed;
  background: #24b724;
  color: white;
  top:0;
  left:0;
  right:0;
  padding: 15px;
  > span i{
    font-weight:700;

    &:before{
      content: '.';
    }
    
    @keyframes hereNotHere {
      from {opacity:0}
      50% {opacity:0}
      to{opacity:1}
    }

    animation: hereNotHere 1.2s linear infinite;

    &:nth-child(2) {
      animation-delay: .4s;
    }
    &:nth-child(3) {
      animation-delay: .8s;
    }
    
  }
`

const UpgradePanel = () => {
  const { t } = useTranslation()
  const upgrading = useSelector(state => state.app.upgrading)

  return upgrading && <ErrorWrapper>{t('server_restarting')} <span><i/><i/><i/></span></ErrorWrapper>
}

export default UpgradePanel;
