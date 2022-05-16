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
        window.onresize = function() {
            const canvas = document.querySelector('#spectrum_canvas')
            const canvas3d = document.querySelector('#spectrum3d_canvas')

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight

            canvas3d.width = window.innerWidth;
            canvas3d.height = window.innerHeight
        }
    }, [])

    useEffect(() => {
        listener.register('canvas_start', EVENTS.PLAYER_START, () => {  
            setTimeout(() => {      
                let {analyzer, canvas, canvas3d} = player.getContext()
                
                let lastValue = null

                function draw() {    
                    if (player.context === null) {
                        let {analyzer: newAnalyser, canvas: newCanvas, canvas3d: newCanvas3d} = player.getContext()
                        analyzer = newAnalyser;
                        canvas = newCanvas
                        canvas3d = newCanvas3d
                    }            
                    
                    const rendererName = spectrum.getRendererName();
                    if (lastValue !== null && lastValue.rendererName !== rendererName) {
                        resetCanvas()
                        canvas.width = canvas.width;
                        const {analyzer: newAnalyser, canvas: newCanvas, canvas3d: newCanvas3d} = player.resetContext();
                        analyzer = newAnalyser;
                        canvas = newCanvas;
                        canvas3d = newCanvas3d
                    }

                    const clear3d = () => {
                        const gl = canvas3d.getContext('webgl')
                        gl?.clear?.(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
                    }

                    const clear2d = () => {
                        const ctx = canvas.getContext('2d');
                        ctx?.clearRect?.(0, 0, canvas.width, canvas.height);
                    }

                    analyzer.fftSize = 2048;
                    var bufferMemoryLength = analyzer.frequencyBinCount;
                    var dataArray = new Uint8Array(bufferMemoryLength);
                    analyzer.getByteTimeDomainData(dataArray);
                    canvas.removeAttribute('data-theme');  
                    lastValue = {
                        ...(spectrum.getRenderer()({analyzer, clear3d, clear2d, lastValue, canvas, canvas3d, bufferMemoryLength, dataArray}) || {}),
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
        <>
            <Canvas id="spectrum_canvas" data-index={canvasIndex} height="1024" width="1024"></Canvas>
            <Canvas id="spectrum3d_canvas" data-index={canvasIndex} height="1024" width="1024"></Canvas>
        </>
    )
}

export default Vizualizer
