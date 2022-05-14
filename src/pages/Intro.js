import React, { useEffect } from 'react'
import App from '../App'
import { useState } from 'react';
import { useAuth } from '../redux/authSlice';
import { useSelector } from 'react-redux';
import Login from './Login';
import Paper from '../components/Paper';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

const Intro = () => {
    const { t } = useTranslation()
    const auth = useAuth()
    const user = useSelector(state => state.auth.user)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        auth.refreshSession()
    }, [])

    useEffect(() => {
        if (user === null) {
            setOpen(false)
        }
    }, [user])


    const openMp3 = () => {
        window.location.href = "/mp3"
    }

    const openRadio = () => {
        window.location.href = "/radio"
    }

    if (!user) {
        return <Login />
    }

    if (open && user.role === 'ADMIN') {
        return <App />
    }

    return (
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh'}}>
            <Paper style={{padding:'50px', display:'flex', flexDirection:'column', gap:'20px'}}>               
                <Button onClick={openMp3}>
                    {t('sound_output')}
                </Button>  
                <Button onClick={openRadio}>
                    {t('radio_output')}
                </Button>  
                {user.role === 'ADMIN' && (
                    <Button onClick={() => setOpen(true)}>
                    {t('admin_area')}
                    </Button>  
                )}
            </Paper>    
        </div>
    )
}

export default Intro