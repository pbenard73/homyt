import React from 'react'
import styled from 'styled-components'

import DashboardIcon from '../components/DashboardIcon';
import { useDashboard , WINDOWS} from '../redux/dashboardSlice';

const DashboardStyled = styled.div`
    height:100vh;
    width:100vw;
    position:relative;
    > div {
        width: 90px;
        height:120px;
        display:inline-block;
        position:relative;
    }
`

const BrowserIcon = () => <img src="/icons/browser.png" alt="File browser" />
const YoutubeIcon = () => <img src="/icons/youtube.png" alt="Youtube icon" />
const SpectrumIcon = () => <img src="/icons/spectrum.png" alt="Spectrum icon" />
const PlaylistIcon = () => <img src="/icons/playlist.png" alt="Playlist icon" />
const RadioIcon = () => <img src="/icons/radio.png" alt="Radio icon" />
const ConfigIcon = () => <img src="/icons/config.png" alt="Config icon" />
const RemoteIcon = () => <img src="/icons/remote.png" alt="Remote icon" />

const Dashboard = () => {
    const dashboard = useDashboard()

    return (
        <DashboardStyled className="dashboard">           
            <div><DashboardIcon Icon={BrowserIcon} label={"window_browser"} onClick={() => dashboard.showWindow(WINDOWS.BROWSER)} /></div>
            <div><DashboardIcon Icon={YoutubeIcon} label={"window_downloader"} onClick={() => dashboard.showWindow(WINDOWS.DOWNLOADER)} /></div>
            <div><DashboardIcon Icon={SpectrumIcon} label={"window_spectrum"} onClick={() => dashboard.showWindow(WINDOWS.SPECTRUM)} /></div>
            <div><DashboardIcon Icon={PlaylistIcon} label={"window_playlist"} onClick={() => dashboard.showWindow(WINDOWS.PLAYLIST)} /></div>
            <div><DashboardIcon Icon={RadioIcon} label={"window_radios"} onClick={() => dashboard.showWindow(WINDOWS.RADIO)} /></div>
            <div><DashboardIcon Icon={ConfigIcon} label={"window_config"} onClick={() => dashboard.showWindow(WINDOWS.CONFIG)} /></div>
            <div><DashboardIcon Icon={RemoteIcon} label={"window_remote"} onClick={() => dashboard.showWindow(WINDOWS.REMOTE)} /></div>
        </DashboardStyled>
    )
}

export default Dashboard