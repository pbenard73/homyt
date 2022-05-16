import React from 'react'
import TranslateIcon from '@mui/icons-material/Translate';
import BrushIcon from '@mui/icons-material/Brush';
import SettingsIcon from '@mui/icons-material/Settings';
import Theme from './Theme';
import Translation from './Translation';
import Tabular from '../../containers/Tabular';
import UserConfig from './UserConfig';

const Profil = () => (       
    <Tabular icons={[BrushIcon, SettingsIcon, TranslateIcon]}>
        <Theme />
        <UserConfig />
        <Translation />
    </Tabular>    
)
    
export default Profil
