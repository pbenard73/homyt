import { Modal as MuiModal} from '@mui/material'
import styled from 'styled-components'


const Modal = styled(MuiModal)`
display: flex;
    align-items: center;
    justify-content: center;
    iframe{
    border:5px solid black;

    @keyframes coco {
      from{
        box-shadow: 090px 101px 100px 0px red;
      }
      25%{
        box-shadow: 20px 500px 5px 0px yellow;
      }
      50%{
        box-shadow: -900px -110px 20px 0px purple;
      }
      75%{
        box-shadow: -30px 80px 80px 0px cyan;
      }
      to{
        box-shadow: 30px 150px 130px 0px lime;
      }
    }
    animation: coco 4s linear infinite alternate-reverse;
    }
    iframe + div {
    position:absolute;
    pointer-events:none;
    inset:0;
    &:before{
      content:'';
      opacity:.7;
      position:absolute;
      inset:0;
    animation: coco 5s 3s linear infinite alternate-reverse;
    }
    &:after{
      content:'';
      opacity:.7;
      position:absolute;
      inset:0;
    animation: coco 7s 2s linear infinite alternate-reverse;
    }
    }
`

export default Modal