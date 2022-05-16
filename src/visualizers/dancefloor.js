import * as THREE from 'three';

const degreeToRadian =  degree => 2 * Math.PI * (degree / 360);

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

const threeVisualizer = ({clear, clear2d, analyzer, lastValue, canvas, canvas3d, bufferMemoryLength, dataArray}) => {
    clear2d()

    analyzer.fftSize = 256;
    bufferMemoryLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferMemoryLength);
    analyzer.getByteFrequencyData(dataArray);


    let lastThreeValue = lastValue?.dancefloor
    let scene, camera, renderer, cubes, spot, spot2, ambientLight;

    if (!lastThreeValue) {
      cubes = []
      lastThreeValue = {}
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.05, 1000 );
      

      /**
       * Create the transparent scene
       */
      scene.background = null;

      renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true });
      renderer.setClearColor( 0x000000, 0 )
      renderer.setSize( window.innerWidth, window.innerHeight );
      
      /**
       * Set the ambient light for cubes colors
       */
      ambientLight = new THREE.AmbientLight( 0xffffff, 0 );
      scene.add( ambientLight );


      /**
       * Create the dancefloor
       */

       const loader = new THREE.TextureLoader();

       const floorGeometry = new THREE.PlaneGeometry(16,16,1);
       const floorMaterial = new THREE.MeshStandardMaterial( {
         map: loader.load(`${process.env.REACT_APP_API}/bg.jpg`)
        } );
       const floor = new THREE.Mesh(floorGeometry, floorMaterial)
       floor.rotateX(THREE.Math.degToRad(-90));
       floor.position.x = -1
       floor.position.z = -1

       scene.add(floor)


       spot = new THREE.SpotLight( 'white', 20, 25, 0.05);
       spot.position.x = -10
       spot.position.y = 5;
       spot.position.z = -10;
       spot.target.position.x = 10
       spot.target.position.y = -1
       spot.target.position.z = 10
       spot.target.updateMatrixWorld();
       scene.add( spot );

       spot2 = new THREE.SpotLight( 'purple', 20, 25, 0.05);
       spot2.position.x = 10
       spot2.position.y = 5;
       spot2.position.z = 10;
       spot2.target.position.x = 10
       spot2.target.position.y = -1
       spot2.target.position.z = 10
       spot2.target.updateMatrixWorld();
       scene.add( spot2 );
  

      /**
       * Create a matrix of 10*10 cubes
       */
      new Array(10).fill('').forEach((_, j) => {
        const currentCube = []
        
        new Array(10).fill('').forEach((_, i) => {
          const geometry = new THREE.PlaneGeometry(1,1,1);
          const material = new THREE.MeshStandardMaterial( { color: COLORS[i], transparent:true, opacity: .1, wireframe : true } );
          const cube = new THREE.Mesh( geometry, material );
          cube.rotateX(THREE.Math.degToRad(-90))
          scene.add( cube );

          cube.position.x = (i - 5) * 1.5;
          cube.position.y = 0.2;
          cube.position.z = (j - 5) * 1.5;

          currentCube.push(cube)
        })

        cubes.push(currentCube)
      })
      
      /**
       * Set the camera position
       */
      camera.position.z = 15;
      camera.position.y = 7;
      camera.lookAt(0,0,0);
    }

    /**
     * Set the visualizer object
     */
    lastThreeValue.renderer = lastThreeValue?.renderer || renderer
    lastThreeValue.ambient = lastThreeValue?.ambient || ambientLight
    lastThreeValue.scene = lastThreeValue?.scene || scene
    lastThreeValue.camera = lastThreeValue?.camera || camera
    lastThreeValue.cubes = lastThreeValue?.cubes || cubes
    lastThreeValue.angle = lastThreeValue?.angle || 0
    lastThreeValue.spotAngle = lastThreeValue?.spotAngle || 0
    lastThreeValue.spot = lastThreeValue?.spot || spot
    lastThreeValue.spot2 = lastThreeValue?.spot2 || spot2

    /**
     * On Window Resize
     */
    lastThreeValue.camera.aspect = window.innerWidth / window.innerHeight;
    lastThreeValue.camera.updateProjectionMatrix();
    lastThreeValue.renderer.setSize( window.innerWidth, window.innerHeight );


    /**
     * Parse the data array and recreate geometries
     */
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
      let opacity = currentValue / 128

      lastThreeValue.cubes.forEach((cubeGroup, groupIndex) => {
        const material = new THREE.MeshStandardMaterial( { color: opacity < .1 ? 'black' : COLORS[groupIndex], transparent: true, opacity: opacity < .1 ? 0 : opacity + 0.5 } );
        lastThreeValue.cubes[groupIndex][index].material.dispose();
        lastThreeValue.cubes[groupIndex][index].material = material;
      })
    })


    /**
     * Make camera run around
     */
    lastThreeValue.camera.position.x = 15 * Math.cos( lastThreeValue.angle );  
    lastThreeValue.camera.position.z = 15 * Math.sin( lastThreeValue.angle );
    lastThreeValue.camera.lookAt(0,0,0);
    lastThreeValue.angle += 0.01;

    lastThreeValue.spot.target.position.x = 10 * Math.cos( lastThreeValue.spotAngle );  
    lastThreeValue.spot.target.position.z = 10 * Math.sin( lastThreeValue.spotAngle ); 
    lastThreeValue.spot.target.updateMatrixWorld(); 
    lastThreeValue.spotAngle += 0.05;

    lastThreeValue.spot2.target.position.x = 5 * Math.cos( lastThreeValue.spotAngle * -1 );  
    lastThreeValue.spot2.target.position.z = 5 * Math.sin( lastThreeValue.spotAngle * -1 ); 
    lastThreeValue.spot2.target.updateMatrixWorld(); 

    if (lastThreeValue.spotAngle >= THREE.Math.degToRad(720)) {
      lastThreeValue.spotAngle = 0;
    }

    let tempOpac = lastThreeValue.spotAngle / THREE.Math.degToRad(360)
    tempOpac = tempOpac <= 1 ? tempOpac : 1 - (tempOpac - 1)
    tempOpac = tempOpac <= 0.1 ? 0.1 : tempOpac


    lastThreeValue.ambient.intensity = tempOpac
    
    /**
     * Render the scene
     */
    lastThreeValue.renderer.render( lastThreeValue.scene, lastThreeValue.camera );
    
    return {
      dancefloor: lastThreeValue
    }
}

export default threeVisualizer