import React from 'react'
import { useVisualizer } from '../redux/visualizerSlice'
import { VISUALIZER } from '../visualizers'
import { useTranslation } from 'react-i18next'
import { AwesomeButton } from "react-awesome-button";

const SpectrumConfig = () => {
    const { t } = useTranslation()
    const visualizer = useVisualizer()
    return (
    <>
        <h1>{t('visualizers')}</h1>
        {Object.keys(VISUALIZER).map(spectrumMode => (
            <AwesomeButton
                type="instagram"
                key={spectrumMode}
                style={{marginRight:'20px'}}
                className="nodrag"
                onPress={() => visualizer.setSpectrum(VISUALIZER[spectrumMode])}
            >
                 {VISUALIZER[spectrumMode]}
            </AwesomeButton>
        ))}
    </>
)
    }
export default SpectrumConfig