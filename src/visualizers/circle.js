const circleVisualizer = ({canvas, bufferMemoryLength, dataArray}) => {
    var    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'red';

    ctx.beginPath();
    var center = 512, radius = 512
    var point = 2*Math.PI/dataArray.length;
    
    
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

    ctx.stroke();
    
}

export default circleVisualizer