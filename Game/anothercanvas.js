const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();  
    }

    update() {
        this.draw();
    }
}

const circles = new Circle(canvas.width / 2, canvas.height / 2, 10, 'blue');

console.log(circles);

circles.draw();

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
     circles.draw();
     circles.y += 1;
    
    }
animate();
