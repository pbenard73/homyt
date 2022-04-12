const circleVisualizer = ({clear, lastValue, canvas, bufferMemoryLength, dataArray}) => {
    var    ctx = canvas.getContext('2d');
    if (clear !== false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const reinit = lastValue?.circle_total === undefined || lastValue.circle_total === lastValue?.circle_count

    const data = {
        circle_total: reinit ? (Math.floor(Math.random() * 10000) % 7) + 1 : lastValue.circle_total,
        circle_count: reinit ? 0 : (lastValue?.circle_count || 0)
    }

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'white';

    ctx.beginPath();
    var point = 2*Math.PI/dataArray.length;
    
    for (var j = 0; j < data.circle_count ; j++){
        var center = 512, radius = 512 - (j  * 75)

        ctx.shadowOffsetY = 4;
        ctx.shadowBlur    = 15;
        ctx.shadowColor   = "orange";
        
        dataArray.forEach((len, i) => {
            var v = dataArray[i] / 128.0 * 200;

            const x = 200 - v + center + radius * Math.cos(point * i);            
                                
            const pureY = 200 - v + center + radius * Math.sin(point * i) 
            
            if(i === 0) {
                ctx.moveTo(x, pureY);
            } else {
                ctx.lineTo(x, pureY);
            }
        })
        ctx.stroke()

    }

    data.circle_count = data.circle_count + 1;
    ctx.stroke();
    
    return data;
}

export default circleVisualizer