import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';

const HumanStyled = styled.div`
    position:fixed;
    pointer-events:none;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:56px;
    color:white;
`

const Human = () => {
  const [time, setTime] = useState('')

  useEffect(() => {
    listener.register('human',  EVENTS.PLAYER_CURRENT_HUMAN, hm => setTime(hm))
  }, [])

  return (
  <HumanStyled>
    {time}      
  </HumanStyled>
)
  }
export default Human 