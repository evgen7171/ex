'use strict';

// canvas
let canvasEl = document.getElementById("canvas");
let ctx = canvasEl.getContext('2d');

const canvasWidth = 600;
const canvasHeight = 600;

const canvasAttribs = {
    height: canvasHeight,
    width: canvasWidth,
    style: `
        align-self: center; 
        margin-top: 35px; 
        outline: 4px dashed #ccc; 
        width: ${canvasWidth}px; 
        height: ${canvasHeight}px;`
};

for (let key in canvasAttribs) {
    canvasEl.setAttribute(key, canvasAttribs[key]);
}

//dots
class Dots {
    constructor(n) {
        this.countPoints = n;

        this.init();
        this.handles();

        this.generatePoints(n);
        this.initMatrix();

        this.render();
    }

    init() {
        this.points = [];
        this.sizeDot = {};
        this.space = {};

        this.sizeDot = {
            width: 10,
            height: 10
        };
        this.space = {
            xBegin: 10, yBegin: 0,
            xEnd: 30, yEnd: 20
            //x = 0..canvasWidth/sizeDot.width
        };

        this.startButton = document.getElementById('start');
        this.stopButton = document.getElementById('stop');
        this.drawButton = document.getElementById('draw');
        this.eraseButton = document.getElementById('erase');
    }

    handles() {
        this.startButton.addEventListener('click', () => {
            this.startProcess();
        });
        this.stopButton.addEventListener('click', () => {
            this.stopProcess();
        });
    }

    initMatrix() {
        this.matrix = [];
        for (let i = 0; i < 60; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < 60; j++) {
                this.matrix[i][j] = 0;
            }
        }
        this.points.forEach(el => {
            this.matrix[el.x][el.y] = 1;
        });
    }

    generatePoints(n) {
        for (let i = 0; i < n; i++) {
            let point = {
                x: Math.floor(Math.random() * (this.space.xEnd - this.space.xBegin) + this.space.xBegin),
                y: Math.floor(Math.random() * (this.space.yEnd - this.space.yBegin) + this.space.yBegin)
            };
            this.points.push(point);
        }
    }

    render() {
        const countEl = document.getElementById('countPoints');
        countEl.textContent = +this.points.length;

        ctx.clearRect(0, 0, 600, 600);
        for (let i = 0; i < 60; i++) {
            for (let j = 0; j < 60; j++) {
                if (this.matrix[i][j]) {
                    ctx.fillRect(
                        i * this.sizeDot.width,
                        j * this.sizeDot.height,
                        this.sizeDot.width,
                        this.sizeDot.height);
                }
            }
        }
    }

    startProcess = () => {

        this.timerId = setInterval(() => {
            this.reMatrix();
            this.render();
        }, 200);
    };

    stopProcess = () => {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    };

    checkPoint(point) {
        let sum = 0;
        for (let i = point.x - 1; i <= point.x + 1; i++) {
            for (let j = point.y - 1; j <= point.y + 1; j++) {
                if (i < 0 || j < 0 || i > 59 || j > 59) {
                    continue;
                }
                if (i !== j) {
                    sum += this.matrix[i][j];
                }
            }
        }
        if (this.points.countPoints < 600) {
            return sum === 2 || sum === 3;
        } else if(this.points.countPoints > 600 && this.points.countPoints < 800){
            return sum === 3;
        } else {
            return sum === 1;
        }
    }

    reMatrix() {
        let arr = [];
        let pixels = [];
        for (let i = 0; i < 60; i++) {
            arr [i] = [];
            for (let j = 0; j < 60; j++) {
                if (this.checkPoint({x: i, y: j})) {
                    arr[i][j] = 1;
                    pixels.push({x: i, y: j});
                } else {
                    arr[i][j] = 0;
                }
            }
        }
        this.matrix = arr;
        this.points = pixels;
    }
}

const dots = new Dots(20);

//TODO сделать функцию перевода canvas в svg

