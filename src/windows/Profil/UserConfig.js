import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { updateUserSettings } from '../../apis/authApi';
import Button from '../../components/Button';
import { useAuth } from '../../redux/authSlice';

const UserConfig = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user);
    const auth = useAuth()


    const openMp3 = () => {
        window.location.href = "/mp3"
    }

    const openRadio = () => {
        window.location.href = "/radio"
    }

    const updateSettings = async (field, newValue) => {
        const newSettings = {...user.settings, [field]: newValue}

        const result = await updateUserSettings({}, newSettings);

        if (result.valid === true) {
            auth.updateUserSettings(field, newValue);
        }
    }

    return (
        <div style={{padding:'10px'}}>
            <FormControlLabel
                control={<Checkbox checked={user.settings?.autoConnectOnAdmin === true} onChange={() => updateSettings('autoConnectOnAdmin', !user.settings?.autoConnectOnAdmin)} />}
                label={t('auto_connect_on_admin')}
            />
            <div style={{marginTop:'10px'}}>
                <Button onClick={openMp3}>
                    {t('sound_output')}
                </Button> 
            </div>
            <div style={{marginTop:'10px'}}>
                <Button onClick={openRadio}>
                    {t('radio_output')}
                </Button>  
            </div> 
        </div>
    )
}
export default UserConfig