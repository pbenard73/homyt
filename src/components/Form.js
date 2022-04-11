import styled from 'styled-components'

const Form = styled.form`
  color:white;
  > div {
    background: rgb(255 255 255 / 31%);
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(3px) hue-rotate(115deg);
    border: 3px solid #898989;
    box-shadow: 5px 8px 17px 9px rgb(0 0 0 / 76%);
    display:flex;
    flex-direction:column;
  }
`

export default Form