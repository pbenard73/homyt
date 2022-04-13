import React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';
import spectrum from '../utils/spectrum';
import './../visualizers/style.scss'
import player, { STATE } from '../utils/player';

const Canvas = styled.canvas`
    height:100vh;
    width:100vw;
    background:rgba(0,0,0,.6);
    position:fixed;
    pointer-events:none;
`

const Vizualizer = () => {
    useEffect(() => {
        listener.register('canvas_start', EVENTS.PLAYER_START, () => {  
            setTimeout(() => {      
                const {analyzer, canvas} = player.getContext()
                
                let lastValue = null

                function draw() {                
                    analyzer.fftSize = 2048;
                    var bufferMemoryLength = analyzer.frequencyBinCount;
                    var dataArray = new Uint8Array(bufferMemoryLength);
                    analyzer.getByteTimeDomainData(dataArray);
                    canvas.removeAttribute('data-theme');  
                    lastValue = spectrum.getRenderer()({analyzer, lastValue, canvas, bufferMemoryLength, dataArray})

                    if (player.getState() !== STATE.PLAYING) {
                        return
                    }

                    setTimeout(() => window.requestAnimationFrame(draw), 45);
                }

                window.requestAnimationFrame(draw);
            })  
        })
    }, [])

    return (
        <Canvas id="spectrum_canvas" height="1024" width="1024"></Canvas>
    )
}

export default Vizualizer
