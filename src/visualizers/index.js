import lineVisualizer from "./line"
import circleVisualizer from "./circle"

export const VISUALIZER = {
    LINE: 'line',
    CIRCLE: 'circle',
}

const visualizers = {
    [VISUALIZER.LINE]: lineVisualizer,
    [VISUALIZER.CIRCLE]: circleVisualizer
}

export default visualizers