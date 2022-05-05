import { Checkbox, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { updateUserSettings } from '../../apis/authApi';
import { THEMES } from '../../data/theme';
import { useAuth } from '../../redux/authSlice';

const Theme = () => {
    const {i18n} = useTranslation()
    const user = useSelector(state => state.auth.user);
    const auth = useAuth()


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
                control={<Checkbox checked={user.settings?.coverAsBackground === true} onChange={() => updateSettings('coverAsBackground', !user.settings?.coverAsBackground)} />}
                label={'Cover as Bg'}
            />

            <input type="color" value={user.settings?.bgcolor ||'black'} onChange={(e) => updateSettings('bgcolor', e.target.value)} />

            <FormControlLabel
            control={<Checkbox checked={user.settings?.coverContain === true} onChange={() => updateSettings('coverContain', !user.settings?.coverContain)} />}
            label={'Cover Bg Contain'}
            />

            <FormControlLabel
            control={<Checkbox checked={user.settings?.rainbow === true} onChange={() => updateSettings('rainbow', !user.settings?.rainbow)} />}
            label={'Rainbow'}
            />

            <FormGroup>
                <InputLabel>THEME</InputLabel>
                <Select value={user.theme} onChange={e => auth.setTheme(e.target.value)}>
                    {Object.values(THEMES).map(themeLabel => (
                        <MenuItem key={themeLabel} value={themeLabel}>{ themeLabel }</MenuItem>
                        ))}
                </Select>
            </FormGroup>
        </div>
    )
}
export default Theme