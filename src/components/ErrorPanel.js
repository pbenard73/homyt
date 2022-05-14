import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components'

const ErrorWrapper = styled.div`
  position: fixed;
  background: #c90a45;
  top:0;
  left:0;
  right:0;
  color: white;
  padding: 15px;
`

const ErrorPanel = () => {
  const { t } = useTranslation()
  const error = useSelector(state => state.app.error)

  return error && <ErrorWrapper>{t('server_error')}</ErrorWrapper>
}

export default ErrorPanel;
