import lineVisualizer from "./line"
import circleVisualizer from "./circle"
import barVisualizer from "./bar"
import fullVisualizer from "./full"
import heartVisualizer from "./heart"
import noneVisualizer from "./none"

export const VISUALIZER = {
    LINE: 'line',
    CIRCLE: 'circle',
    BAR: 'bar',
    HEART: 'heart',
    FULL: 'full',
    NONE: 'none',
}

const visualizers = {
    [VISUALIZER.LINE]: lineVisualizer,
    [VISUALIZER.CIRCLE]: circleVisualizer,
    [VISUALIZER.BAR]: barVisualizer,
    [VISUALIZER.HEART]: heartVisualizer,
    [VISUALIZER.FULL]: fullVisualizer,
    [VISUALIZER.NONE]: noneVisualizer
}

export default visualizers