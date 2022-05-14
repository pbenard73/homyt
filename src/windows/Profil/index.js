import React from 'react'
import TranslateIcon from '@mui/icons-material/Translate';
import BrushIcon from '@mui/icons-material/Brush';
import Theme from './Theme';
import Translation from './Translation';
import Tabular from '../../containers/Tabular';

const Profil = () => (       
    <Tabular icons={[BrushIcon, TranslateIcon]}>
        <Theme />
        <Translation />
    </Tabular>    
)
    
export default Profil
