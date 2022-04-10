import React from 'react'
import { useEffect,  useRef } from 'react'
import { useVisualizer } from '../redux/visualizerSlice';
import styled from 'styled-components'
import listener, { EVENTS } from '../utils/listener';
import spectrum from '../utils/spectrum';
import './../visualizers/style.scss'

const Canvas = styled.canvas`
    height:100vh;
    width:100vw;
    background:rgba(0,0,0,.6);
    position:fixed;
    pointer-events:none;
`

const Vizualizer = () => {
    const canvasRef = useRef();

    const visualizer = useVisualizer()

    useEffect(() => {
        visualizer.setCanvas(canvasRef.current)

        listener.register('canvas_start', EVENTS.PLAYER_START, () => {
            const audioElement = document.querySelector('#casper_video')
            const canvas = document.querySelector('#spectrum_canvas')

            var audioContext = new (window.AudioContext || window.webkitAudioContext)();
            var source = audioContext.createMediaElementSource(audioElement);
            var analyser = audioContext.createAnalyser();
            let gainNode = audioContext.createGain();
            source.connect(gainNode );
            source.connect(analyser  );
        
            gainNode.connect(audioContext.destination);

            let lastValue = null

            function draw() {                
                analyser.fftSize = 2048;
                var bufferMemoryLength = analyser.frequencyBinCount;
                var dataArray = new Uint8Array(bufferMemoryLength);
                analyser.getByteTimeDomainData(dataArray);

                canvas.removeAttribute('data-theme');  
                lastValue = spectrum.getRenderer()({lastValue, canvas, bufferMemoryLength, dataArray})
                
               window.requestAnimationFrame(draw);
            }

            window.requestAnimationFrame(draw);
        })

    }, [])

    return (
        <Canvas id="spectrum_canvas" ref={canvasRef} height="1024" width="1024"></Canvas>
    )
}

export default Vizualizer
