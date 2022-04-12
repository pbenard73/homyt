import React from 'react'
import styled from 'styled-components'

import Draggable from 'react-draggable';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
const IconWrapper = styled.div`
    width: 90px;
    height:120px;
    align-items:center;
    justify-content:center;
    display:inline-flex;
    flex-direction:column;
    text-align:center;
    cursor:pointer;
    color:white;
    position:absolute;
    top: 10px;
    .handle{
        position:absolute;
        top:0;
        left:0;
    }
    &:not(:hover){
        .handle{
            display:none;
        }
    }
`



const DashboardIcon = ({Icon, label, position, onClick}) => {
    const { t} = useTranslation();

    return (
    <Draggable handle={".handle"}>

    <IconWrapper position={position} onClick={(e) => {
        if (e.target.closest('.handle') === null) {
            onClick?.()
        }
    }}>
            <span className="handle">X</span>
        <Icon />
        <span>{t(label)}</span>
    </IconWrapper>
    </Draggable>
)
}

export default DashboardIcon