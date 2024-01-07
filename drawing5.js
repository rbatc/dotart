function init(pattern, colourful, delay, circle, rotate) {
	//Coordinates assume center of canvas is 0,0
	// top left is -250, 250
	let numballs = 100;

	//create a ball
	const canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");
	let balls = [];
	let theta;
	let r = 200;

	for (var j=0; j<numballs; j++) {
		let colour = colourful ? makecolour(j, numballs):'black';
		//colour = makecolour(j, numballs);
		//balls.push(new ball(-250 + j*500/numballs, -100+j*500/numballs, 5, 0, 0, colour, ctx, pattern, delay));
		let theta = 2*Math.PI/numballs * j;
		let x = circle ? r*Math.cos(theta):0;
		let y = circle ? r*Math.sin(theta):0;
		let velx = rotate ? -r*Math.sin(theta)/50 - x/100 : 0;
		let vely = rotate ? r*Math.cos(theta)/50 - y/100 : 0;
		balls.push(new ball(x, y, 5, velx, vely, colour, pattern, delay*j*100/numballs, ctx));
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
		if (ball.wakecount % 250 == 0) {
		    ball.velx = 0;
		    ball.vely = 0;
			ball.pattern += 1;
		}

		//update velocity and positions
		if (ball.wakecount > ball.delay) {
			ball.update(timestep);
		}

		//draw the balls
		ball.draw();
	}

	window.requestAnimationFrame(update);
}


function ball(x,y,r,vx,vy,colour,pattern,delay,ctx) {
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
	    let distance = Math.sqrt(this.x**2 + this.y**2);
	    let g = 0.005;
	    let scalefactor = Math.sqrt(g/distance);
		switch (this.pattern) {
			case 0:
			    //basic gravity in both directions, keeps getting bigger for some reason?
			    this.velx -= this.x * scalefactor;
			    this.vely -= this.y * scalefactor;
				break;
			case 1:
			//basic gravity in horizontal direction, keeps getting bigger for some reason?
                this.velx -= this.x * scalefactor;
                //this.vely -= this.y * scalefactor;
                break;
			case 2:
			//basic gravity in vertical direction, keeps getting bigger for some reason?
                //this.velx -= this.x * scalefactor;
                this.vely -= this.y * scalefactor;
                break;
            case 3:
                //gravity with some spice
                //this.x -= this.y/200;
                //this.y += this.x/200;
                this.velx += Math.abs(this.y * scalefactor) * (this.x>0?-0.5:0.5);
                this.vely += Math.abs(this.x * scalefactor) * (this.y>0?-0.5:0.5);
                break;
			default:
			    this.pattern = 0;
				//this.vely -= 0.1;
		}

		//update position
		this.x += this.velx * timestep;
		this.y += this.vely * timestep;
	}

}

balls = init(3, false, 0, true, false);
update();