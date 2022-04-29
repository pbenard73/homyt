import React, { useEffect } from 'react'
import App from '../App'
import { AwesomeButton } from "react-awesome-button";
import { useState } from 'react';
import { useAuth } from '../redux/authSlice';
import { useSelector } from 'react-redux';
import Login from './Login';
import Paper from '../components/Paper';

const Intro = () => {
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
                <AwesomeButton
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={openMp3}
                >
                    Ecouter Sortie Son
                </AwesomeButton>  
                <AwesomeButton
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={openRadio}
                >
                    Ecouter Sortie Radio
                </AwesomeButton>  
                {user.role === 'ADMIN' && (
                    <AwesomeButton
                    className="nodrag"
                    type="instagram"
                    style={{marginRight:'20px'}}
                    onPress={() => setOpen(true)}
                    >
                        Admin Area
                    </AwesomeButton>  
                )}
            </Paper>    
        </div>
    )
}

export default Intro