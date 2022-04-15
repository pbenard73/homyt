const heartVisualizer = ({clear, analyzer, lastValue, canvas, bufferMemoryLength, dataArray}) => {
    const ctx = canvas.getContext('2d')

    analyzer.fftSize = 256;
    bufferMemoryLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferMemoryLength);
    analyzer.getByteFrequencyData(dataArray);

    if (clear !== false) {
        canvas.setAttribute('data-theme', 'heart');
    }


    let feelingSizes = [
        [],
        [],
        [],
        []
    ]

    dataArray.forEach((feelingSize, index) => {
        if (index < 10) {
            feelingSizes[0].push(feelingSize)
        } else if (index < 30) {
            feelingSizes[1].push(feelingSize)
        } else if (index < 60) {
            feelingSizes[2].push(feelingSize)
        } else {
            feelingSizes[3].push(feelingSize)
        }
    })

    let heartSizes = feelingSizes.map(heartbeats => heartbeats.reduce((a, b) => (a + b), 0) / heartbeats.filter(i => i !== 0).length).map(i => isNaN(i) ? 0 : i)

    if (heartSizes.reduce((a,b) => (a + b), 0) > 0) {
        ctx.clearRect(0,0,canvas.width, canvas.height)
    } else {
        return {}
    }


    const bigSize = heartSizes[0] * 800 / 128;
    const highSize = heartSizes[1] * 750 / 128;
    const mediumSize = heartSizes[2] * 700 / 128;
    const lowSize = heartSizes[3] * 800 / 128;

    function drawHeart(fromx, fromy, tox, toy,lw,hlen,color) {
        var x = fromx;
        var y = fromy;
        var width = lw ;
        var height = hlen;
      
      //  ctx.save();
        ctx.beginPath();
        var topCurveHeight = height * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
          x, y, 
          x - width / 2, y, 
          x - width / 2, y + topCurveHeight
        );
      
        // bottom left curve
        ctx.bezierCurveTo(
          x - width / 2, y + (height + topCurveHeight) / 2, 
          x, y + (height + topCurveHeight) / 2, 
          x, y + height
        );
      
        // bottom right curve
        ctx.bezierCurveTo(
          x, y + (height + topCurveHeight) / 2, 
          x + width / 2, y + (height + topCurveHeight) / 2, 
          x + width / 2, y + topCurveHeight
        );
      
        // top right curve
        ctx.bezierCurveTo(
          x + width / 2, y, 
          x, y, 
          x, y + topCurveHeight
        );
      
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
      //  ctx.restore();
      }

    
   drawHeart(512 , 512 - (bigSize / 2) ,null,null, bigSize, bigSize, '#260238e8')
   drawHeart(512 , 512 - (highSize / 2) ,null,null, highSize, highSize, '#f31b41c4')
   drawHeart(512 , 512 - (mediumSize / 2) ,null,null, mediumSize, mediumSize, '#fb8ff7c4')
   drawHeart(512 , 512 - (lowSize / 2) ,null,null, lowSize, lowSize, '#ffdbfec4')

    return {}
}

export default heartVisualizer