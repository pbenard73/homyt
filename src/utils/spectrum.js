import visualizers, { VISUALIZER } from "../visualizers";
import storage, { STORAGE } from "./storage";

class Spectrum {
    renderer= storage.get(STORAGE.SPECTRUM) || VISUALIZER.NONE
    setRenderer(renderer) {
        storage.set(STORAGE.SPECTRUM, renderer)
        this.renderer = renderer
    }
    getRenderer() {
        return visualizers[this.renderer]
    }
}

const spectrum = new Spectrum()

export default spectrum
