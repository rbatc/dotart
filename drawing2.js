function init(pattern, colourful) {
	//Coordinates assume center of canvas is 0,0
	// top left is -250, 250
	let numballs = 200;

	//create a ball
	const canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");
	let balls = [];
	let theta;
	let r = 200;

	for (var j=0; j<numballs; j++) {
		let colour = colourful ? makecolour(j, numballs):'black';
		//colour = makecolour(j, numballs);
		switch (pattern) {
			case 1:
				delay = 0;
				break;
			case 2:
				delay = 0;
				break;
			case 3:
				delay = 0;//j*400/numballs;
				break;
			default:
				delay = 0;
		}
		//balls.push(new ball(-200+8*j, -100+5*j, 5, 0, 0, colour, ctx));
		theta = 2*Math.PI/numballs * j;
		balls.push(new ball(r*Math.cos(theta), r*Math.sin(theta), 5, 0, 0, colour, ctx, pattern, delay));
	}
	return balls;
}

function makecolour(j, numballs) {
	let sixth = numballs/6;

	let r = 0;
	let g = 0;
	let b = 0;

	//one colour fades in or out every for every sixth of the number of balls
	if (j<=sixth) {
		//magenta to red
		r = 255;
		g = 0;
		let i = j;
		b = Math.max(0, 255 - i*255/sixth);
	}
	else if (j>sixth && j<=2*sixth) {
		//red to yellow
		r = 255;
		let i = j - sixth;
		g = Math.min(255, i*255/sixth);
		b = 0;
	}
	else if (j>2*sixth && j<=3*sixth) {
		//yellow to green
		let i = j - 2*sixth;
		r = Math.max(0, 255 - i*255/sixth);
		g = 255;
		b = 0;
	}
	else if (j>3*sixth && j<=4*sixth) {
		//green to cyan
		r = 0;
		g = 255;
		let i = j - 3*sixth;
		b = Math.min(255, i*255/sixth);
	}
	else if (j>4*sixth && j<=5*sixth) {
		//cyan to blue
		r = 0;
		let i = j - 4*sixth;
		g = Math.max(0, 255 - i*255/sixth);
		b = 255;
	}
	else if (j>5*sixth) {
		//blue to magenta
		let i = j - 5*sixth;
		r = Math.min(255, i*255/sixth);
		g = 0;
		b = 255;
	}

	let text1 = "rgb(";
	let colourstr = text1.concat(r.toString(), ",", g.toString(), ",", b.toString(), ")");
	return colourstr;
}


function update() {
	//clear the canvas
	const canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);


	//get time gap
	timestep = 0.1;

	for (let i=0; i<balls.length; i++) {
		ball = balls[i];
		ball.wakecount += 1;
		/*
		if (ball.wakecount%300 == 0) {
			ball.pattern +=1;
			ball.pattern = ball.pattern%4;
		}
		*/

		//update velocity and positions
		if (ball.wakecount > ball.delay) {
			ball.update(timestep);
		}

		//draw the balls
		ball.draw();
	}

	window.requestAnimationFrame(update);
}


function ball(x,y,r,vx,vy,colour,ctx,pattern,delay) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.ctx = ctx;
	this.velx = vx;
	this.vely = vy;
	this.colour = colour;
	this.pattern = pattern;
	this.delay = delay;
	this.wakecount = 0;
	this.draw = function() {
		this.ctx.beginPath();
		this.ctx.arc(250+this.x, 250-this.y, this.r, 0, 2 * Math.PI);
		this.ctx.fillStyle = this.colour;
		this.ctx.fill();
	}
	this.update = function(timestep) {
		switch (this.pattern) {
			case 0:
				this.velx += -1/40000*(this.x * Math.abs(this.y));
				this.vely += -1/40000*(this.y * Math.abs(this.x));
				break;
			case 1:
				this.velx += -1/40000*(this.x * Math.abs(this.y));
				this.vely += -1/40000*(this.y * Math.abs(this.x));
				break;
				/*
				this.velx += this.x>0 ? -0.1:0.1;
				this.vely += this.y>0 ? -0.1:0.1;
				break;
				*/
			case 2:
				//also accelerate towards center;
				this.velx += -this.x/200;
				this.vely += -this.y/200;
				break;
			case 3:
				//just rotation
				this.velx = -this.y/100;
				this.vely = this.x/100;
			break;
			default:
				this.vely -= 0.1;
		}

		//update position
		this.x += this.velx * timestep;
		this.y += this.vely * timestep;
	}

}

balls = init(1, true);
update();