const barVisualizer = ({clear, analyzer, lastValue, canvas, bufferMemoryLength, dataArray}) => {  
    analyzer.fftSize = 256;
    bufferMemoryLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferMemoryLength);
    analyzer.getByteFrequencyData(dataArray);

   // var barWidth = (canvas.width / dataArray.length) * 2.5;
    var barWidth = ((canvas.width + dataArray.length) / dataArray.length) ;
    var x = 0;

    if (clear !== false) {
        canvas.setAttribute('data-theme', 'bar');
    }

    var    ctx = canvas.getContext('2d');
    if (clear !== false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.stroke();

    const colors = ['rgba(155, 8, 173, .55)', 'rgba(240,255,0,.5)', 'rgba(0,255,74,.5)']

    ctx.beginPath();
    for(var i = 0; i < dataArray.length; i++) {
        var hheight = dataArray[i] * 512 / 128 
        ctx.fillStyle = colors[Math.floor(i * 2 / dataArray.length * colors.length) ];
        ctx.fillRect(x,1024 - hheight,barWidth,hheight);
        x += barWidth + 1;
      }

    ctx.stroke();

    return {}
}

export default barVisualizer