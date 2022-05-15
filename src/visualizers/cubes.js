import * as THREE from 'three';

const COLORS = [
  "#cc00ff",
  "#ff5699",
  "#ff0017",
  "#f67f00",
  "#f7ff00",
  "#91ff00",
  "#08ff00",
  "#00ffee",
  "#008dff",
  "#0015ff"
]

const threeVisualizer = ({clear, analyzer, lastValue, canvas, bufferMemoryLength, dataArray}) => {
    analyzer.fftSize = 256;
    bufferMemoryLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferMemoryLength);
    analyzer.getByteFrequencyData(dataArray);


    let lastThreeValue = lastValue?.three
    let scene, camera, renderer, cubes;

    if (!lastThreeValue) {
      cubes = []
   //   const ctx = canvas.getContext('webgl')
      lastThreeValue = {}
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 1000 );
      
      scene.background = null;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setClearColor( 0x000000, 0 )
      renderer.setSize( window.innerWidth, window.innerHeight );
      

      new Array(10).fill('').forEach((_, j) => {
        const currentCube = []
        
        new Array(10).fill('').forEach((_, i) => {
          const geometry = new THREE.BoxGeometry(1,1,1);
          const material = new THREE.MeshBasicMaterial( { color: COLORS[i] } );
          const cube = new THREE.Mesh( geometry, material );
          scene.add( cube );

          cube.position.x = (i - 5) * 1.5;
          cube.position.y = 0;
          cube.position.z = (j - 5) * 1.5;

          currentCube.push(cube)
        })

        cubes.push(currentCube)
      })
      
      camera.position.z = 5;
      camera.position.y = 8;
      camera.lookAt(0,0,0);
    }

    lastThreeValue.renderer = lastThreeValue?.renderer || renderer
    lastThreeValue.scene = lastThreeValue?.scene || scene
    lastThreeValue.camera = lastThreeValue?.camera || camera
    lastThreeValue.cubes = lastThreeValue?.cubes || cubes
    lastThreeValue.angle = lastThreeValue?.angle || 0

    dataArray.reduce((oldValue, actualValue, index) => {
      if (index % 13 === 0) {
        oldValue.push([actualValue])
      } else {
        oldValue[oldValue.length - 1].push(actualValue)
      }

      return oldValue;
    }, [])
    .map(group => group.reduce((oldValue, actual) => oldValue + actual, 0) / group.length)
    .forEach((currentValue, index) => {
      const height = currentValue * 2 / 128

      lastThreeValue.cubes.forEach((cubeGroup, groupIndex) => {
        lastThreeValue.cubes[groupIndex][index].geometry = new THREE.BoxGeometry(1, height);
        lastThreeValue.cubes[groupIndex][index].position.set(lastThreeValue.cubes[groupIndex][index].position.x, height / 2 ,lastThreeValue.cubes[groupIndex][index].position.z)
      })
    })

    lastThreeValue.camera.position.x = 15 * Math.cos( lastThreeValue.angle );  
    lastThreeValue.camera.position.z = 15 * Math.sin( lastThreeValue.angle );
    lastThreeValue.camera.lookAt(0,0,0);
    lastThreeValue.angle += 0.01;

    lastThreeValue.renderer.render( lastThreeValue.scene, lastThreeValue.camera );
    
    return {
      ...lastValue,
      three: lastThreeValue
    }
}

export default threeVisualizer