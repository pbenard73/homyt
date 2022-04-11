import React from 'react'
import styled from 'styled-components'

import DashboardIcon from '../components/DashboardIcon';
import { useDashboard , WINDOWS} from '../redux/dashboardSlice';

const DashboardStyled = styled.div`
    height:100vh;
    width:100vw;
    position:relative;
`

const BrowserIcon = () => <img src="/icons/browser.png" alt="File browser" />
const YoutubeIcon = () => <img src="/icons/youtube.png" alt="Youtube icon" />
const SpectrumIcon = () => <img src="/icons/spectrum.png" alt="Spectrum icon" />
const PlaylistIcon = () => <img src="/icons/playlist.png" alt="Playlist icon" />
const RadioIcon = () => <img src="/icons/radio.png" alt="Radio icon" />

const Dashboard = () => {
    const dashboard = useDashboard()

    return (
        <DashboardStyled className="dashboard">           
            <DashboardIcon position={10} Icon={BrowserIcon} label={"Explorateur de Fichiers"} onClick={() => dashboard.showWindow(WINDOWS.BROWSER)} />
            <DashboardIcon position={120} Icon={YoutubeIcon} label={"Acquisition Youtuve"} onClick={() => dashboard.showWindow(WINDOWS.DOWNLOADER)} />
            <DashboardIcon position={230}Icon={SpectrumIcon} label={"Spectrum"} onClick={() => dashboard.showWindow(WINDOWS.SPECTRUM)} />
            <DashboardIcon position={340}Icon={PlaylistIcon} label={"Playlist"} onClick={() => dashboard.showWindow(WINDOWS.PLAYLIST)} />
            <DashboardIcon position={450}Icon={RadioIcon} label={"Radio"} onClick={() => dashboard.showWindow(WINDOWS.RADIO)} />
        </DashboardStyled>
    )
}

export default Dashboard