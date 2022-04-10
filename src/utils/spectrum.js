import visualizers, { VISUALIZER } from "../visualizers";

class Spectrum {
    renderer= VISUALIZER.LINE
    setRenderer(renderer) {
        this.renderer = renderer
    }
    getRenderer() {
        return visualizers[this.renderer]
    }
}

const spectrum = new Spectrum()

export default spectrum
