import lineVisualizer from "./line"
import circleVisualizer from "./circle"
import barVisualizer from "./bar"
import fullVisualizer from "./full"
import noneVisualizer from "./none"

export const VISUALIZER = {
    LINE: 'line',
    CIRCLE: 'circle',
    BAR: 'bar',
    FULL: 'full',
    NONE: 'none',
}

const visualizers = {
    [VISUALIZER.LINE]: lineVisualizer,
    [VISUALIZER.CIRCLE]: circleVisualizer,
    [VISUALIZER.BAR]: barVisualizer,
    [VISUALIZER.FULL]: fullVisualizer,
    [VISUALIZER.NONE]: noneVisualizer
}

export default visualizers