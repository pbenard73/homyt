import React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';
import spectrum from '../utils/spectrum';
import './../visualizers/style.scss'
import player, { STATE } from '../utils/player';
import { useApp } from '../redux/appSlice';
import { useSelector } from 'react-redux';

const Canvas = styled.canvas`
    height:100vh;
    width:100vw;
    background:rgba(0,0,0,.6);
    position:fixed;
    pointer-events:none;
`

const Vizualizer = () => {
    const app = useApp();
    const canvasIndex = useSelector(state => state.app.canvasIndex)

    const resetCanvas = () => {
        app.resetCanvas()
    }

    useEffect(() => {
        listener.register('canvas_start', EVENTS.PLAYER_START, () => {  
            setTimeout(() => {      
                let {analyzer, canvas} = player.getContext()
                
                let lastValue = null

                function draw() {    
                    if (player.context === null) {
                        let {analyzer: newAnalyser, canvas: newCanvas} = player.getContext()
                        analyzer = newAnalyser;
                        canvas = newCanvas
                    }            
                    
                    const rendererName = spectrum.getRendererName();
                    if (lastValue !== null && lastValue.rendererName !== rendererName) {
                        resetCanvas()
                        canvas.width = canvas.width;
                        const {analyzer: newAnalyser, canvas: newCanvas} = player.resetContext();
                        analyzer = newAnalyser;
                        canvas = newCanvas;
                    }

                    analyzer.fftSize = 2048;
                    var bufferMemoryLength = analyzer.frequencyBinCount;
                    var dataArray = new Uint8Array(bufferMemoryLength);
                    analyzer.getByteTimeDomainData(dataArray);
                    canvas.removeAttribute('data-theme');  
                    lastValue = {
                        ...(spectrum.getRenderer()({analyzer, lastValue, canvas, bufferMemoryLength, dataArray}) || {}),
                        rendererName
                    }
                    if (player.getState() !== STATE.PLAYING) {
                        return
                    }

                    setTimeout(() => window.requestAnimationFrame(draw));
                }

                window.requestAnimationFrame(draw);
            })  
        })
    }, [canvasIndex])

    return (
        <Canvas id="spectrum_canvas" data-index={canvasIndex} height="1024" width="1024"></Canvas>
    )
}

export default Vizualizer
