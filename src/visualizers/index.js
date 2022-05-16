import lineVisualizer from "./line"
import circleVisualizer from "./circle"
import barVisualizer from "./bar"
import fullVisualizer from "./full"
import heartVisualizer from "./heart"
import fireworkVisualizer from "./fireworks"
import cubesVisualizer from "./cubes"
import danceFloorVisualizer from "./dancefloor"
import noneVisualizer from "./none"

export const VISUALIZER = {
    LINE: 'line',
    CIRCLE: 'circle',
    BAR: 'bar',
    FIREWORK: 'firework',
    HEART: 'heart',
    FULL: 'full',
    CUBES: 'cubes',
    DANCEFLOOR: 'dancefloor',
    NONE: 'none',
}

const visualizers = {
    [VISUALIZER.LINE]: lineVisualizer,
    [VISUALIZER.CIRCLE]: circleVisualizer,
    [VISUALIZER.FIREWORK]: fireworkVisualizer,
    [VISUALIZER.BAR]: barVisualizer,
    [VISUALIZER.HEART]: heartVisualizer,
    [VISUALIZER.FULL]: fullVisualizer,
    [VISUALIZER.CUBES]: cubesVisualizer,
    [VISUALIZER.DANCEFLOOR]: danceFloorVisualizer,
    [VISUALIZER.NONE]: noneVisualizer
}

export default visualizers