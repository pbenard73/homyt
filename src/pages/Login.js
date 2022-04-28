import React, { useState } from 'react'
import App from '../App'
import { AwesomeButton } from "react-awesome-button";
import Paper from '../components/Paper';
import { TextField } from '@mui/material';
import { useAuth } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const auth = useAuth()
    const { t } = useTranslation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async e => {
        e.preventDefault();

        auth.login(t, username, password)
    }

    return (
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100vh'}}>
            <Paper >
                <form onSubmit={onSubmit} style={{padding:'50px', display:'flex', flexDirection:'column', gap:'20px'}}>

                <TextField label={t('username')} value={username} onChange={e => setUsername(e.target.value)} />
                <TextField label={t('password')} value={password} onChange={e => setPassword(e.target.value)} />
                <AwesomeButton
                    className="nodrag"
                    type="instagram"
                    style={{marginRight:'20px'}}
                    onPress={onSubmit}
                >
                    {t('login')}
                </AwesomeButton>  
                </form>
            </Paper>    
        </div>
    )
}

export default Login