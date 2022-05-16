const fireworksVisualizer = ({clear, clear3d, analyzer, lastValue, canvas, bufferMemoryLength, dataArray}) => {
    clear3d()
    
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.stroke()

    analyzer.fftSize = 256;
    bufferMemoryLength = analyzer.frequencyBinCount;
    dataArray = new Uint8Array(bufferMemoryLength);
    analyzer.getByteFrequencyData(dataArray);


    let feelingSizes = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]

    dataArray.forEach((feelingSize, index) => {
        if (index < 10) {
            feelingSizes[0].push(feelingSize)
        } else if (index < 20) {
            feelingSizes[1].push(feelingSize)
        } else if (index < 30) {
            feelingSizes[2].push(feelingSize)
        } else if (index < 40) {
            feelingSizes[3].push(feelingSize)
        } else if (index < 50) {
            feelingSizes[4].push(feelingSize)
        } else if (index < 60) {
            feelingSizes[5].push(feelingSize)
        } else if (index < 70) {
            feelingSizes[6].push(feelingSize)
        } else if (index < 80) {
            feelingSizes[7].push(feelingSize)
        } else {
            feelingSizes[8].push(feelingSize)
        }
    })
    let heartSizes = feelingSizes.map(heartbeats => heartbeats.reduce((a, b) => (a + b), 0) / heartbeats.filter(i => i !== 0).length).map(i => isNaN(i) ? 0 : i)

    const data = {
        ...(lastValue || {}),
        fw: {
            cw: canvas.width,
            ch: canvas.height,
            particles: [],
            partCount: 100,
            fireworks: [],
            mx: canvas.width/2,
            my: canvas.height/2,
            currentHue: 170,
            partSpeed: 10,
            partSpeedVariance: 10,
            partWind: 100,
            partFriction: 50,
            partGravity: 0,
            hueMin: 0,
            hueMax: 360,
            fworkSpeed: 2,
            fworkAccel: 10,
            hueVariance: 130,
            flickerDensity: 20,
            showShockwave: true,
            showTarget: false,
            clearAlpha: 80,
            lineWidth:1,
            dt:0,
            oldTime: Date.now(),
            numberOfAttack:0,
            stars:[],
            ...(lastValue?.fw || {})
        }
    }

    var n_stars = 150
    var colors = [ '#176ab6', '#fb9b39']
    for ( let i = 0; i < 98; i++) {
      colors.push( '#fff')
    }

    const randomInt = ( max, min) => Math.floor( Math.random() * (max - min) + min)
    class Star {
        constructor( x, y, radius, color) {
          this.x = x || randomInt( 0, canvas.width)
          this.y = y || randomInt( 0, canvas.height)
          this.radius = radius || Math.random() * 1.1
          this.color = color || colors[randomInt(0, colors.length)]
          this.dy = -Math.random() * .3
        }
        draw () {
          ctx.beginPath()
          ctx.arc( this.x, this.y, this.radius, 0, Math.PI *2 )
          ctx.shadowBlur = randomInt( 3, 15)
          ctx.shadowColor = this.color
          ctx.strokeStyle = this.color
          ctx.fillStyle = 'rgba( 255, 255, 255, .5)'
          ctx.fill()
          ctx.stroke()
          ctx.closePath()
        }
        update( arrayStars = [] ) {
          if ( this.y - this.radius < 0 ) this.createNewStar( arrayStars )
          
          this.y += this.dy
          this.draw()
        }
        createNewStar( arrayStars = [] ) {
          let i = arrayStars.indexOf( this )
          arrayStars.splice( i, 1)
          arrayStars.push( new Star( false, canvas.height + 5))
        }
      }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

     var rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);}
       
        var Particle = function(x, y, hue){
            this.x = x;
            this.y = y;
            this.coordLast = [
                {x: x, y: y},
                {x: x, y: y},
                {x: x, y: y}
            ];
            this.angle = rand(0, 360);
            this.speed = rand(((data.fw.partSpeed - data.fw.partSpeedVariance) <= 0) ? 1 : data.fw.partSpeed - data.fw.partSpeedVariance, (data.fw.partSpeed + data.fw.partSpeedVariance));
            this.friction = 1 - data.fw.partFriction/100;
            this.gravity = data.fw.partGravity/2;
            this.hue = rand(hue-data.fw.hueVariance, hue+data.fw.hueVariance);
            this.brightness = rand(50, 80);
            this.alpha = rand(40,100)/100;
            this.decay = rand(10, 50)/1000;
            this.wind = (rand(0, data.fw.partWind) - (data.fw.partWind/2))/25;
            this.lineWidth = data.fw.lineWidth;
        };
        
        Particle.prototype.update = function(index){
            var radians = this.angle * Math.PI / 180;
            var vx = Math.cos(radians) * this.speed;
            var vy = Math.sin(radians) * this.speed + this.gravity;
            this.speed *= this.friction;
                            
            this.coordLast[2].x = this.coordLast[1].x;
            this.coordLast[2].y = this.coordLast[1].y;
            this.coordLast[1].x = this.coordLast[0].x;
            this.coordLast[1].y = this.coordLast[0].y;
            this.coordLast[0].x = this.x;
            this.coordLast[0].y = this.y;
            
            this.x += vx * data.fw.dt;
            this.y += vy * data.fw.dt;
            
            this.angle += this.wind;				
            this.alpha -= this.decay;
            
            if(this.alpha < .05){					
                data.fw.particles.splice(index, 1);	
            }			
        };
        
        Particle.prototype.draw = function(){
            var coordRand = (rand(1,3)-1);
            ctx.beginPath();								
            ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
            ctx.lineTo(Math.round(this.x), Math.round(this.y));
            ctx.closePath();				
            ctx.strokeStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+this.alpha+')';
            ctx.stroke();				
            
            if(data.fw.flickerDensity > 0){
                var inverseDensity = 50 - data.fw.flickerDensity;					
                if(rand(0, inverseDensity) === inverseDensity){
                    ctx.beginPath();
                    ctx.arc(Math.round(this.x), Math.round(this.y), rand(this.lineWidth,this.lineWidth+3)/2, 0, Math.PI*2, false)
                    ctx.closePath();
                    var randAlpha = rand(50,100)/100;
                    ctx.fillStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+randAlpha+')';
                    ctx.fill();
                }	
            }
        };
        
        /*=============================================================================*/	
        /* Create Particles
        /*=============================================================================*/
        const createParticles = function(x,y, hue){
            var countdown = data.fw.partCount;
            while(countdown--){						
                data.fw.particles.push(new Particle(x, y, hue));
            }
        };
        
        /*=============================================================================*/	
        /* Update Particles
        /*=============================================================================*/		
        const updateParticles = function(){
            var i = data.fw.particles.length;
            while(i--){
                var p = data.fw.particles[i];
                p.update(i);
            };
        };
        
        /*=============================================================================*/	
        /* Draw Particles
        /*=============================================================================*/
        const drawParticles = function(){
            var i = data.fw.particles.length;
            while(i--){
                var p = data.fw.particles[i];				
                p.draw();				
            };
        };
        
        /*=============================================================================*/	
        /* Firework Constructor
        /*=============================================================================*/
        var Firework = function(startX, startY, targetX, targetY, i){
            this.x = startX;
            this.y = startY;
            this.startX = startX;
            this.startY = startY;
            this.hitX = false;
            this.hitY = false;
            this.coordLast = [
                {x: startX, y: startY},
                {x: startX, y: startY},
                {x: startX, y: startY}
            ];
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = data.fw.fworkSpeed;
            this.angle = Math.atan2(targetY - startY, targetX - startX);
            this.shockwaveAngle = Math.atan2(targetY - startY, targetX - startX)+(90*(Math.PI/180));
            this.acceleration = data.fw.fworkAccel/100;
            this.hue = data.fw.currentHue;
            this.brightness = rand(50, 80);
            this.alpha = rand(50,100)/100;
            this.lineWidth = (10 - i) / 3;//data.fw.lineWidth;
            this.targetRadius = 1;
        };
        
        Firework.prototype.update = function(index){
            ctx.lineWidth = this.lineWidth;
                
            var vx = Math.cos(this.angle) * this.speed;
            var vy = Math.sin(this.angle) * this.speed;
            this.speed *= 1 + this.acceleration;				
            this.coordLast[2].x = this.coordLast[1].x;
            this.coordLast[2].y = this.coordLast[1].y;
            this.coordLast[1].x = this.coordLast[0].x;
            this.coordLast[1].y = this.coordLast[0].y;
            this.coordLast[0].x = this.x;
            this.coordLast[0].y = this.y;
            
            if(data.fw.showTarget){
                if(this.targetRadius < 8){
                    this.targetRadius += .25 * data.fw.dt;
                } else {
                    this.targetRadius = 1 * data.fw.dt;	
                }
            }
            
            if(this.startX >= this.targetX){
                if(this.x + vx <= this.targetX){
                    this.x = this.targetX;
                    this.hitX = true;
                } else {
                    this.x += vx * data.fw.dt;
                }
            } else {
                if(this.x + vx >= this.targetX){
                    this.x = this.targetX;
                    this.hitX = true;
                } else {
                    this.x += vx * data.fw.dt;
                }
            }
            
            if(this.startY >= this.targetY){
                if(this.y + vy <= this.targetY){
                    this.y = this.targetY;
                    this.hitY = true;
                } else {
                    this.y += vy * data.fw.dt;
                }
            } else {
                if(this.y + vy >= this.targetY){
                    this.y = this.targetY;
                    this.hitY = true;
                } else {
                    this.y += vy * data.fw.dt;
                }
            }				
            
            if(this.hitX && this.hitY){
                var randExplosion = rand(0, 9);
                createParticles(this.targetX, this.targetY, this.hue);
                data.fw.fireworks.splice(index, 1);					
            }
        };
        
        Firework.prototype.draw = function(){
            ctx.lineWidth = this.lineWidth;
                
            var coordRand = (rand(1,3)-1);					
            ctx.beginPath();							
            ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
            ctx.lineTo(Math.round(this.x), Math.round(this.y));
            ctx.closePath();
            ctx.strokeStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+this.alpha+')';
            ctx.stroke();	
            
            if(data.fw.showTarget){
                ctx.save();
                ctx.beginPath();
                ctx.arc(Math.round(this.targetX), Math.round(this.targetY), this.targetRadius, 0, Math.PI*2, false)
                ctx.closePath();
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            }
                
            if(data.fw.showShockwave){
                ctx.save();
                ctx.translate(Math.round(this.x), Math.round(this.y));
                ctx.rotate(this.shockwaveAngle);
                ctx.beginPath();
                ctx.arc(0, 0, 1*(this.speed/5), 0, Math.PI, true);
                ctx.strokeStyle = 'hsla('+this.hue+', 100%, '+this.brightness+'%, '+rand(25, 60)/100+')';
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
                ctx.restore();
            }								 
        };
        
        /*=============================================================================*/	
        /* Create Fireworks
        /*=============================================================================*/
        const createFireworks = function(startX, startY, targetX, targetY, i){		            	
            data.fw.fireworks.push(new Firework(startX, startY, targetX, targetY, i));
        };
        
        /*=============================================================================*/	
        /* Update Fireworks
        /*=============================================================================*/		
        const updateFireworks = function(){
            var i = data.fw.fireworks.length;
            while(i--){
                var f = data.fw.fireworks[i];
                f.update(i);
            };
        };
        
        /*=============================================================================*/	
        /* Draw Fireworks
        /*=============================================================================*/
        const drawFireworks = function(){
            var i = data.fw.fireworks.length;			
            while(i--){
                var f = data.fw.fireworks[i];		
                f.draw();
            };
        };
        
      
      /*=============================================================================*/	
        /* Delta
        /*=============================================================================*/
        const updateDelta = function(){
            var newTime = Date.now();
            data.fw.dt = (newTime - data.fw.oldTime)/16;
            data.fw.dt = (data.fw.dt > 5) ? 5 : data.fw.dt;
            data.fw.oldTime = newTime;	
        }
        
        /*=============================================================================*/	
        /* Main Loop
        /*=============================================================================*/       

            updateDelta();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = "rgba(0,0,0,.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'lighter';
            updateFireworks();
            updateParticles();
            drawFireworks();			
            drawParticles();	
            
            if (data.fw.numberOfAttack < 9) {
                var x = 0;
                var barWidth = ((canvas.width + heartSizes.length) / heartSizes.length) ;
                for(var i = 0; i < heartSizes.length; i++) {
                        if (i === data.fw.numberOfAttack && heartSizes[i] > 0) {                       
                        
                        var hheight = 1024 - (heartSizes[i] * 1024 / 128) 
                        var targetY = hheight + 300;
                        var targetX = x + (barWidth / 2)
                        createFireworks(512, 1024,targetX,targetY, i) 
                    }

                    x += barWidth + 1;                    
                }
                data.fw.numberOfAttack++;
            }  else {
                data.fw.numberOfAttack = 0
            }

            if (data.fw.stars.length === 0) {
                for( let i = 0; i < n_stars; i++ ) {
                    data.fw.stars.push( new Star( ) )
                  }
            }

            data.fw.stars.forEach( s => s.update( data.fw.stars ))
            ctx.stroke()
    return data
}

export default fireworksVisualizer