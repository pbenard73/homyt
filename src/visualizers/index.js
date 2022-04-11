import lineVisualizer from "./line"
import circleVisualizer from "./circle"
import barVisualizer from "./bar"
import fullVisualizer from "./full"

export const VISUALIZER = {
    LINE: 'line',
    CIRCLE: 'circle',
    BAR: 'bar',
    FULL: 'full',
}

const visualizers = {
    [VISUALIZER.LINE]: lineVisualizer,
    [VISUALIZER.CIRCLE]: circleVisualizer,
    [VISUALIZER.BAR]: barVisualizer,
    [VISUALIZER.FULL]: fullVisualizer
}

export default visualizers