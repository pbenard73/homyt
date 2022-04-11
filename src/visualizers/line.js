const lineVisualizer = ({clear, lastValue, canvas, bufferMemoryLength, dataArray}) => {
    var    ctx = canvas.getContext('2d');
    if (clear !== false) {
        canvas.setAttribute('data-theme', 'line');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.stroke();

    ctx.lineWidth = 1.5;

    var segment = 1024 * 1.0 / bufferMemoryLength;
    

    if (Array.isArray(lastValue?.data) === true) {
        var x = 0;
        ctx.beginPath();
        ctx.strokeStyle = 'white';     
        ctx.lineWidth = 3;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur    = 15;
        ctx.shadowColor   = "orange";

        for (var i = 0; i < lastValue.data.length; i++){        
            ctx[i === 0 ? 'moveTo' : 'lineTo'](...lastValue.data[i]);
        }
        ctx.stroke();
    }

    let currentValue = {
        data: []
    }

    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'cyan';
    x = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0
    ctx.shadowBlur    = 0
    ctx.shadowColor   = "transparent";

    for (var i = 0; i < dataArray.length; i++)    {            
        var v = dataArray[i] / 128.0;
        var y = v * 512 /2;
        currentValue.data.push([x,v * 1024 /2]);

        ctx[i === 0 ? 'moveTo' : 'lineTo'](x,y);

        x += segment;
    }

    ctx.stroke();

    return currentValue
}

export default lineVisualizer