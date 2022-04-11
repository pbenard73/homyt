import lineVisualizer from "./line"
import circleVisualizer from "./circle"
import barVisualizer from "./bar"

const fullVisualizer = (options) => {  
  var    ctx = options.canvas.getContext('2d');
 
      ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
  circleVisualizer({...options, clear:false})
  const last = lineVisualizer({...options, clear:false})
  barVisualizer({...options, clear:false})

    return last
}

export default fullVisualizer