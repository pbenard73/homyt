import React from 'react'
import { useVisualizer } from '../redux/visualizerSlice'
import { VISUALIZER } from '../visualizers'
import { useTranslation } from 'react-i18next'
import { List, ListItem, ListItemText } from '@mui/material';

const SpectrumConfig = () => {
    const { t } = useTranslation()
    const visualizer = useVisualizer()

    return (
        <>
            <h1>{t('visualizers')}</h1>
            <List className="nodrag">
                {Object.keys(VISUALIZER).map(spectrumMode => (
                    <ListItem 
                        key={spectrumMode}
                        onClick={() => visualizer.setSpectrum(VISUALIZER[spectrumMode])}
                    >
                        <ListItemText primary={t(`spectrum_${VISUALIZER[spectrumMode]}`)} />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default SpectrumConfig
