import React from 'react'
import { AwesomeButton } from "react-awesome-button";
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { softwareUpdate } from '../api';
import Button from '../components/Button';
import { useApp } from '../redux/appSlice';

const Config = () => {
    const {i18n} = useTranslation()
    const mpdMode = useSelector(state => state.app.mpdMode)
    const app = useApp()

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
                <Button
                style={{marginRight:'20px'}}
                onClick={() => app.setMpdMode(!mpdMode)}
                >
                    {`MPD Status : ${mpdMode ? 'active' : 'not active'}`}
                </Button>  

                <hr />

            {languages.map(([locale, label]) => (
                <Button
                key={locale}
                style={{marginRight:'20px'}}
                onClick={() => i18n.changeLanguage(locale)}
                >
                    {label}
                </Button>
            ))}        
        </div>
    )
}
export default Config