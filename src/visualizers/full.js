import lineVisualizer from "./line"
import circleVisualizer from "./circle"
import barVisualizer from "./bar"

const fullVisualizer = (options) => {  
  options.clear3d();
  
  options.canvas.setAttribute('data-theme', 'full');
  var    ctx = options.canvas.getContext('2d');
 
      ctx.clearRect(0, 0, options.canvas.width, options.canvas.height);
  let last = circleVisualizer({...options, clear:false})
  last = {...lineVisualizer({...options, clear:false}), ...last}
  barVisualizer({...options, clear:false})

    return last
}

export default fullVisualizer