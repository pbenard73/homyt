import { useSelector } from "react-redux"
import { getPicture } from "../api";
import styled from 'styled-components'

const Background = styled.div`
    height: 100vh;
    width:100vw;
    position:fixed;
    inset:0;
    pointer-events:none;
    background-position:center center;
    background-repeat: no-repeat;
`

const UserBackground = () => {
    const user = useSelector(state => state.auth.user);
    const mpdStatus = useSelector(state => state.app.mpdStatus) || {}
    const {artist, title, file} = (mpdStatus?.current || {})
    const isRadio = file?.indexOf?.('http') === 0;


    const rainbowStyle = `
        @keyframes rainbow {
            from {filter: hue-rotate(0deg);}
            to {filter: hue-rotate(360deg);}
        }
        #root{
            animation: rainbow 60s linear infinite;
        }
    `

    return (
        <>
        {user.settings?.rainbow && <style dangerouslySetInnerHTML={{__html: rainbowStyle}} />}
        {user.settings?.coverAsBackground === true && (
            <Background style={{
                backgroundColor: user.settings?.bgcolor || 'black',
                backgroundImage: `url(${getPicture.url({path: file?.replace?.(/\./g, '_'), query: title, radio: isRadio, big: true})})`,
                backgroundSize: user.settings?.coverContain === true ? 'contain' : 'cover',
            }}></Background>
        )}
        </>
    )
}

export default UserBackground