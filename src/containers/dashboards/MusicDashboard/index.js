import { AppBar } from '@mui/material';
import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux';
import ProgressToolBar from './ProgressToolBar';
import Controls from './Controls';
import Volume from './Volume';
import StartMenu from './StartMenu';
import Artist from './Artist';
import Hour from './Hour';

const MusicStyled = styled.div`
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

const MusicDashboard = () => {
    const style = `
        #root{
            background-image: url(/music_dash/bg.jpg);
        }
        canvas{
            background: transparent !important;
        }
    `

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: style}} />
            <MusicStyled className="dashboard">     
                <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }} id="app_toolbar" style={{backgroundColor:'#161616'}}>
                    <ProgressToolBar variant="dense">
                        <StartMenu />
                        <span style={{marginLeft:'auto', marginRight:'auto'}}>
                            <Artist />
                        </span>
                        <div style={{display:'flex', flexDirection:'row', gap:'5px', height:'100%', alignItems:'center'}}>
                            <Controls />
                            <Volume />
                            <Hour />
                        </div>
                    </ProgressToolBar>
                </AppBar>
            </MusicStyled>
        </>
    )
}

export default MusicDashboard