import React from 'react'
import styled from 'styled-components'
import { useVisualizer } from '../redux/visualizerSlice'
import { VISUALIZER } from '../visualizers'


const SpectrumConfig = () => {
    const visualizer = useVisualizer()
    return (
    <>
    <h1>Spectrums</h1>
    {Object.keys(VISUALIZER).map(spectrumMode => (
        <button onClick={() => visualizer.setSpectrum(VISUALIZER[spectrumMode])} key={spectrumMode}>{VISUALIZER[spectrumMode]}</button>
    ))}
    </>
)
    }
export default SpectrumConfig