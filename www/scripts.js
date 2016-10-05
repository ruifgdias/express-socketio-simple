let users = new Map(),
    name;

document.addEventListener("DOMContentLoaded", function (event) {
    (() => {
        let canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            x, y, socket = io();

        name = prompt("Please enter your name", "");

        // Start util functions
        let resizeCanvas = () => {
            console.log("resize");
            ctx.canvas.width = canvas.width = window.innerWidth;
            ctx.canvas.height = canvas.height = window.innerHeight;
            redraw();
        }

        let clearCanvas = () => {
            ctx.beginPath();
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        let drawMe = () => {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.arc(x * canvas.width / 100, y * canvas.height / 100, 15, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.stroke();
        }

        let drawOthers = () => {
            ctx.beginPath();
            for (let [key, val] of users.entries()) {
                ctx.font = "20px serif";
                ctx.textBaseline = "hanging";
                ctx.strokeText(key, val.x * canvas.width / 100, val.y * canvas.height / 100);
                ctx.fillStyle = 'green';
                ctx.fill();
            }
            ctx.stroke();
            ctx.closePath();
        }

        let updateAll = (evt) => {
            x = Math.floor(evt.x / canvas.width * 100);
            y = Math.floor(evt.y / canvas.height * 100);
            let move = {
                name,
                x,
                y
            }
            socket.emit('move', move);
            redraw();
        }

        let updateUsers = user => {
            users.set(user.name, user);
            redraw();
        }

        let redraw = () => {
            clearCanvas();
            drawMe();
            drawOthers();
        }

        // End util functions


        //receive a move from other user
        socket.on('move', data => updateUsers(data));

        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', resizeCanvas(), false);

        // detect mousemove on canvas, redraw and send move information to others users
        canvas.addEventListener('mousemove',(evt) => updateAll(evt), false);

        resizeCanvas();
    })();
});