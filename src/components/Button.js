import { Button as MuiButton } from "@mui/material"
import AwesomeButton from "react-awesome-button"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { THEMES } from "../data/theme"

const Awesome = ({children, ...props}) => (
    <AwesomeButton
        type="instagram"
        style={{marginRight:'20px'}}
        className="nodrag"
        onPress={props?.onClick}
        {...props}
    >
        {children}
    </AwesomeButton>
)

const ThemeMusic = styled(MuiButton)`
    border-radius:0px !important;
    background-color: #1b9ccd !important;
`

const Music = ({children, ...props}) => (
    <ThemeMusic
        className="nodrag"
        variant="contained"
        {...props}
    >{children}</ThemeMusic>
)

const Buttons = {
    [THEMES.COLORIZED]: Awesome,
    [THEMES.MUSIC]: Music
}

const Button = ({children, ...props}) => {
    const userTheme = useSelector(state => state.auth.user?.theme)
    
    const Button = Buttons[userTheme]

    return (
        <Button {...props}>{children}</Button>
    )
}

export default Button;