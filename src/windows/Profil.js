import { FormGroup, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react'
import { AwesomeButton } from "react-awesome-button";
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { softwareUpdate } from '../api';
import Button from '../components/Button';
import { THEMES } from '../data/theme';
import { useApp } from '../redux/appSlice';
import { useAuth } from '../redux/authSlice';

const Profil = () => {
    const {i18n} = useTranslation()
    const mpdMode = useSelector(state => state.app.mpdMode)
    const userTheme = useSelector(state => state.auth.user.theme)
    const app = useApp()
    const auth = useAuth()

    const languages = [
        ['fr', 'Francais'],
        ['en', 'English'],
        ['it', 'Italiano'],
        ['es', 'Español'],
        ['pt', 'Português'],
        ['ar', 'عرب'],
        ['tr', 'Türkçe'],
    ]

    return (
        <div style={{padding:'10px'}}>
        <Button
        style={{marginRight:'20px'}}
        onClick={() => softwareUpdate()}
        >
            {"UPGRADE"}
        </Button>  

        <hr />

        <Select value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
            {languages.map(([locale, label]) => (
                <MenuItem key={locale} value={locale}>{ label }</MenuItem>
            ))}
        </Select>
        <hr />

                <FormGroup>
<InputLabel>THEME</InputLabel>
        <Select value={userTheme} onChange={e => auth.setTheme(e.target.value)}>
            {Object.values(THEMES).map(themeLabel => (
                <MenuItem key={themeLabel} value={themeLabel}>{ themeLabel }</MenuItem>
                ))}
        </Select>
                </FormGroup>

                <Button
                style={{marginRight:'20px'}}
                onClick={() => app.setMpdMode(!mpdMode)}
                >
                    {`MPD Status : ${mpdMode ? 'active' : 'not active'}`}
                </Button>  

                <hr />
        </div>
    )
}
export default Profil