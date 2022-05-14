import React, { useState } from 'react'
import styled from "styled-components";
import Paper from '../components/Paper';
import { TextField } from '@mui/material';
import { useAuth } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from '../components/Button';

const LoginWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    overflow:hidden;
    height: 100vh;
    > div {
        border: 0px !important;
    }
`

const Login = () => {
    const auth = useAuth()
    const { t } = useTranslation()
    const isInstall = useSelector(state => state.auth.install)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async e => {
        e.preventDefault();

        auth.login(t, username, password)
    }

    return (
        <LoginWrapper>
            <Paper>
                <form onSubmit={onSubmit} style={{padding:'50px', display:'flex', flexDirection:'column', gap:'20px'}}>
                {isInstall && <p style={{textAlign:'center'}}>{t('Installation')}</p>}
                <TextField label={t('username')} value={username} onChange={e => setUsername(e.target.value)} />
                <TextField label={t('password')} value={password} onChange={e => setPassword(e.target.value)} />
                <Button type="submit">
                    {t(isInstall ? 'install_create_user' : 'login')}
                </Button>  
                </form>
            </Paper>    
        </LoginWrapper>
    )
}

export default Login