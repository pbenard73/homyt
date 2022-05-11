import { TextField as MuiTextField } from "@mui/material"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { THEMES } from "../data/theme"

const MusicTextField = styled(MuiTextField)({
  '& label': {
    color: 'white',
  },
  '& label.Mui-focused': {
    color: 'white',
  },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      color:'white',
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
});

const TEXTFIELDS = {
    [THEMES.COLORIZED]: MusicTextField,
    [THEMES.MUSIC]: MusicTextField
}

const TextField = ({children, ...props}) => {
    const userTheme = useSelector(state => state.auth.user?.theme)
    
    const CustomTextField = TEXTFIELDS[userTheme]

    return (
        <CustomTextField {...props}>{children}</CustomTextField>
    )
}

export default TextField;