import { useTranslation } from "react-i18next"
import { MenuItem, Select } from '@mui/material';

const Translation = () => {
    const {i18n} = useTranslation()

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
        <div>
            <Select value={i18n.language} onChange={e => i18n.changeLanguage(e.target.value)}>
            {languages.map(([locale, label]) => (
                <MenuItem key={locale} value={locale}>{ label }</MenuItem>
            ))}
            </Select>
        </div>
    )
}

export default Translation;