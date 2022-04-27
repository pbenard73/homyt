import React from 'react'
import { AwesomeButton } from "react-awesome-button";
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
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
                <AwesomeButton
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={() => app.setMpdMode(!mpdMode)}
                >
                    {`MPD Status : ${mpdMode ? 'active' : 'not active'}`}
                </AwesomeButton>  

                <hr />

            {languages.map(([locale, label]) => (
                <AwesomeButton
                key={locale}
                className="nodrag"
                type="instagram"
                style={{marginRight:'20px'}}
                onPress={() => i18n.changeLanguage(locale)}
                >
                    {label}
                </AwesomeButton>
            ))}        
        </div>
    )
}
export default Config