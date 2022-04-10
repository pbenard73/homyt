import React from 'react'
import styled from 'styled-components'
import Vizualizer from '../components/Vizualizer'
import { useApp } from '../redux/appSlice'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';

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

const Dashboard = () => {
    const dashboard = useDashboard()

    return (
        <DashboardStyled className="dashboard">
           
                 <DashboardIcon position={10} Icon={BrowserIcon} label={"Explorateur de Fichiers"} onClick={() => dashboard.showWindow(WINDOWS.BROWSER)} />

         
                <DashboardIcon position={120} Icon={YoutubeIcon} label={"Acquisition Youtuve"} onClick={() => dashboard.showWindow(WINDOWS.DOWNLOADER)} />
                <DashboardIcon position={230}Icon={SpectrumIcon} label={"Spectrum"} onClick={() => dashboard.showWindow(WINDOWS.SPECTRUM)} />
        </DashboardStyled>
    )
}

export default Dashboard