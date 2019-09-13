'use strict';

//TODO сделать функцию для посторения линий между всеми уздами между которыми есть связи
//TODO сделать функцию для построения вектор-связей - пути

//TODO ..по заданию начального и конечно пункта
//TODO ..с выключением каких-то пунктов

//TODO графическое отображение в виде графа

//TODO сделать поиск кратчайшего пути (ценность пути, время)
//TODO сделать поиск пути по важности узлов

//TODO сделать как андроид-приложение
//TODO сделать как десктоп приложение
//TODO сделать как веб-приложение (фронт, бэк)

//-----------

function fCos(alpha) {
    return Math.cos(alpha / 180 * Math.PI)
}

function fSin(alpha) {
    return Math.sin(alpha / 180 * Math.PI)
}

function dist(point1, point2) {
    return Math.sqrt(
        (point1.x - point2.x) * (point1.x - point2.x) +
        (point1.y - point2.y) * (point1.y - point2.y));
}

function randomOf(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function createTable(arr) {
    let table = [];
    let keys = Object.keys(arr);
    let len = keys.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            table[i * len + j] = [];
            table[i * len + j][0] = keys[i];
            table[i * len + j][1] = keys[j];
            table[i * len + j][2] = valueOfArrIdx(arr, i, j);
        }
    }
    return table;
}

class FieldInfo {
    constructor(infoId) {
        this.infoId = infoId;
        this.infoEl = document.getElementById(infoId);
    }

    clearInfo() {
        const infoEl = document.getElementById(this.infoId);
        infoEl.textContent = '';
    }

    fillInfo(textArr) {
        const infoEl = document.getElementById(this.infoId);
        for (let i = 0; i < textArr.length; i++) {
            infoEl.textContent += textArr[i] + '\n';
        }
        this.handle();
    }

    handle() {
        this.infoEl.addEventListener('click', () => {
            let e=event.target;
            console.log(e.selectionStart,e.selectionEnd);
        })
    }
}


class CanvasObject {
    constructor(canvasId, data) {
        this.initCanvas(canvasId);
        this.renderKnots(data);
    }

    initCanvas(canvasId) {
        this.canvasId = canvasId;
        this.canvasEl = document.getElementById(this.canvasId);
        this.context = this.canvasEl.getContext('2d');

        const tableEl = document.getElementById('table');
        this.canvasEl.setAttribute('style', `width: ${tableEl.offsetWidth}px`);

        this.canvasEl.height = this.canvasEl.offsetHeight;
        this.canvasEl.width = this.canvasEl.offsetWidth;

        this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.radiusCircle = 10;
    }

    renderKnots(data) {
        let massiveCenters = [];
        let textValue = '';
        let textName = '';
        const r = this.radiusCircle;
        this.coords = data.coords;
        this.connects = data.connects;
        let x, y;

        for (let i = 0; i < Object.keys(this.coords).length; i++) {
            let coords = this.coords[Object.keys(this.coords)[i]];
            x = coords.x;
            y = coords.y;
            this.paintCircle(x, y, r);
            textName = Object.keys(this.coords)[i];
            this.writeLegend(x - r / 2, y + r / 2, textName);

            // if (textName === start) {
            //     this.context.fillStyle = 'rgba(0, 128, 0, 0.3)';
            //     this.context.fill();
            // } else if (textName === end) {
            //     this.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
            //     this.context.fill();
            // }
        }
    }

    writeLegend(x, y, text) {
        this.context.font = "15px Verdana";
        this.context.fillStyle = 'black';
        this.context.fillText(text, x, y);
    }

    paintCircle(x, y, r) {
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.stroke();
    }

    renderLink(startKnot, endKnot) {
        let startCoords, endCoords;
        data.forEach(el => {
            if (el.name === startKnot) {
                startCoords = el.coords;
            } else if (el.name === endKnot) {
                endCoords = el.coords;
            }
        });
        this.context.beginPath();
        this.context.moveTo(startCoords.x, startCoords.y);
        this.context.lineTo(endCoords.x, endCoords.y);
        this.context.stroke();
        this.context.closePath();
    }

    renderArrow(startKnot, endKnot) {
        let
            x1, y1,
            x2, y2,
            x3, y3,
            x4, y4,
            alpha, phi,
            sizeArrow, lenArrow,
            error = '';
        data.forEach(el => {
            if (el.name === startKnot) {
                x1 = el.coords.x;
                y1 = el.coords.y;
            } else if (el.name === endKnot) {
                x2 = el.coords.x;
                y2 = el.coords.y;
            } else {
                error = startKnot + '->' + endKnot;
            }
        });
        sizeArrow = 20;
        alpha = 15;
        lenArrow = dist({x: x1, y: y1}, {x: x2, y: y2});
        x3 = x2 + sizeArrow * ((x1 - x2) / lenArrow * fCos(alpha) - (y1 - y2) / lenArrow * fSin(alpha));
        y3 = y2 + sizeArrow * ((y1 - y2) / lenArrow * fCos(alpha) + (x1 - x2) / lenArrow * fSin(alpha));
        x4 = x2 + sizeArrow * ((x1 - x2) / lenArrow * fCos(alpha) + (y1 - y2) / lenArrow * fSin(alpha));
        y4 = y2 + sizeArrow * ((y1 - y2) / lenArrow * fCos(alpha) - (x1 - x2) / lenArrow * fSin(alpha));
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.lineTo(x3, y3);
        this.context.lineTo(x4, y4);
        this.context.lineTo(x2, y2);
        this.context.stroke();
        this.context.closePath();
        return error;
    }

    renderPath(sequence) {
        let errorStr = 'error:';
        for (let i = 1; i < sequence.length; i++) {
            let error = this.renderArrow(sequence[i - 1], sequence[i]);
            if (error) {
                errorStr += ' ' + error;
            }
        }
        if (errorStr === 'error:') {
            errorStr = '';
        }
        return errorStr;
    }
}

class Sequences {
    constructor(arr) {
        this.sequences = [];
        this.usedElems = [];
        this.getSequences(arr);
        this.arrStrings = this.getArrStrings();
    }

    getSequences(arr) {
        let ch;
        for (let i = 0; i < arr.length; i++) {
            ch = arr.splice(i, 1)[0];
            this.usedElems.push(ch);
            if (arr.length === 0) {
                this.sequences.push(this.usedElems.slice());
            }
            this.getSequences(arr);
            arr.splice(i, 0, ch);
            this.usedElems.pop();
        }
    }

    getArrStrings() {
        let arr = this.sequences;
        let str = [];
        for (let i = 0; i < arr.length; i++) {
            str[i] = arr[i].join('');
        }
        return str;
    }
}

class Button {
    constructor(btnText, graph) {
        this.create(btnText);
        this.graph = graph;
        this.handle();
    }

    create(btnText) {
        this.btnPatternEl = document.getElementById('buttons');
        this.btnText = btnText;
        const words = btnText.split(' ');
        let str = '';
        words.forEach(word => {
            if (word) {
                str += word[0].toUpperCase() + word.slice(1);
            }
        });
        this.btnName = 'btn' + str;
        this.btnId = this.btnName + 'Id';
        const textHTML = `<button name="${this.btnName}" id="${this.btnId}" class="button">${btnText}</button>`;
        this.btnPatternEl.insertAdjacentHTML('beforeend', textHTML);
        this.btnEl = document.getElementById(this.btnId);
    }

    handle() {
        this.btnEl.addEventListener('click', () => {
            event.preventDefault();
            this.graph.refreshInfo('info');
        })
    }
}

class TableObject {
    constructor(tableId, graph) {
        this.graph = graph;
        this.data = graph.data;
        this.tableEl = document.getElementById(tableId);
        this.fillTable(tableId);
        this.handle();
    }

    fillTable(tableId) {
        let value;
        let textHTML = '';
        textHTML += '<tr>';
        for (let j = -1; j < Object.keys(this.data.connects).length; j++) {
            if (j === -1) {
                textHTML += `<td class="cell"></td>`;
                continue;
            }
            textHTML += `<td class="cell red${this.data.knots[j] === this.data.endKnot ? 'S' : ''}">${Object.keys(this.data.connects)[j]}</td>`;
        }
        textHTML += '</tr>';
        for (let i = 0; i < Object.keys(this.data.connects).length; i++) {
            textHTML += '<tr>';
            textHTML += `<td class="cell green${this.data.knots[i] === this.data.startKnot ? 'S' : ''}">${Object.keys(this.data.connects)[i]}</td>`;
            for (let j = 0; j < Object.keys(this.data.connects).length; j++) {
                value = Object.values(this.data.connects)[i][Object.keys(this.data.connects)[j]];
                if (value) {
                    textHTML += i === j ? '<td class="cell yellow">' : '<td class="cell">';
                    textHTML += value;
                } else {
                    textHTML += i === j ? '<td class="cell yellow">' : '<td class="cell grey">';
                }
                textHTML += '</td>';
            }
            textHTML += '</tr>';
        }
        this.tableEl.insertAdjacentHTML('beforeend', textHTML);
    }

    handle() {
        this.tableEl.addEventListener('click', () => {
            event.target.classList.forEach(word => {
                this.handleCellToKnot(word);
                this.graph.refreshInfo('info');
            })
        })
    }

    handleCellToKnot(word) {
        if (word === 'red' || word === 'green') {
            const knotSEl = document.querySelector('.' + word + 'S');
            knotSEl.classList.remove(word + 'S');
            knotSEl.classList.add(word);
            const knotEl = event.target;
            knotEl.classList.remove(word);
            knotEl.classList.add(word + 'S');
            if (word === 'green') {
                this.graph.setStartKnot(event.target.textContent);
            } else if (word === 'red') {
                this.graph.setEndKnot(event.target.textContent);
            }
        }
    }
}

class Graph {
    constructor(data) {

        this.init();
        this.tableObject = new TableObject('table', this);
        this.canvasObj = new CanvasObject('canvas', this.data);
        this.fieldInfo = new FieldInfo('info', this);
        this.sequences = new Sequences(this.knots);

        this.getBranches();
        this.defBranchesDiffLength = this.getBranchesDiffLength(this.branches);

        // let br = this.getBranchesDefLength(this.defBranches, this.knots.length-2);
        // this.canvasObj.renderPath(br[0].str);

        this.renderButtons('buttons');
    }

    init() {
        this.knots = [];
        this.connects = [];
        this.coords = [];

        data.forEach(el => {
            this.knots.push(el.name);
            this.connects[el.name] = el.connects;
            this.coords[el.name] = el.coords;
        });
        this.setStartKnot(this.knots[0]);
        this.setEndKnot(this.knots[this.knots.length - 1]);
        this.data = {
            knots: this.knots,
            connects: this.connects,
            coords: this.coords,
            startKnot: this.startKnot,
            endKnot: this.endKnot
        };
    }

    refreshInfo(infoId) {
        this.getBranches();
        const strArr = this.getStrArr(this.branches);
        this.fieldInfo.clearInfo();
        this.fieldInfo.fillInfo(strArr);
    }

    setStartKnot(startKnot) {
        this.startKnot = startKnot;
    }

    setEndKnot(endKnot) {
        this.endKnot = endKnot;
    }

    getStrArr(branches) {
        const arr = [];
        for (let i = 0; i < branches.length; i++) {
            arr.push(branches[i].str + ' | sum = ' + branches[i].sum);
        }
        return arr;
    }

    renderButtons(buttonsId) {
        // const btnObject = new Button('get branches', this);
    }

    valueOfArrIdx(firstIndex, secondIndex) {
        let firstKnot = Object.keys(this.connects)[firstIndex];
        if (this.connects[firstKnot] === undefined) {
            return undefined;
        }
        return Object.values(this.connects[firstKnot])[secondIndex];
    }

    valueOfArr(firstKnot, secondKnot) {
        let firstIdx, secondIdx;
        for (let i = 0; i < Object.keys(this.connects).length; i++) {
            if (Object.keys(this.connects)[i] === firstKnot) {
                firstIdx = i;
            } else if (Object.keys(this.connects)[i] === secondKnot) {
                secondIdx = i;
            }
        }
        if (this.connects[firstKnot] === undefined) {
            return undefined;
        }
        return Object.values(this.connects[firstKnot])[secondIdx];
    }

    getSum(str) {
        let len = Object.keys(this.connects).length;
        let
            ch1 = str[0],
            ch2,
            value;
        let sum = 0;
        let i = 1;
        while (i < str.length) {
            ch2 = str[i];
            value = this.valueOfArr(ch1, ch2);
            if (typeof (value) === 'undefined' || value === 'undefined') {
                return {sum: sum, ch: ch1};
            }
            sum += value;
            ch1 = ch2;
            i++;
        }
        return {sum: sum, ch: ''};
    }

    getAllBranches() {
        let branches = [];
        let gSum = {};
        let strArr = this.sequences.arrStrings;
        for (let i = 0; i < strArr.length; i++) {
            gSum = this.getSum(strArr[i]);
            branches[i] = {
                str: strArr[i],
                sum: gSum.sum,
                ch: gSum.ch
            }
        }
        return branches;
    }

    getAllBranchesFrom(startKnot) {
        const allBranches = this.getAllBranches();
        let branches = [];
        const arr = [];
        let ch, str;
        for (let i = 1; i < allBranches.length; i++) {
            str = allBranches[i].str;
            ch = allBranches[i].ch;
            if (str[0] === startKnot) {
                arr.push(allBranches[i]);
            }
        }
        branches = this.getShortBranches(arr);
        this.killRepeatBranch(branches);
        return branches;
    }

    getAllBranchesTo(endKnot) {
        const allBranches = this.getAllBranches();
        let branches = [];
        const arr = [];
        let ch, str;
        for (let i = 1; i < allBranches.length; i++) {
            str = allBranches[i].str;
            ch = allBranches[i].ch;
            if (ch === endKnot) {
                arr.push(allBranches[i]);
            } else if (str[str.length - 1] === endKnot && ch === '') {
                arr.push(allBranches[i]);
            }
        }
        branches = this.getShortBranches(arr);
        this.killRepeatBranch(branches);
        return branches;
    }

    getBranches() {
        const allBranches = this.getAllBranches();
        let branches = [];
        const arr = [];
        let ch, str;
        for (let i = 1; i < allBranches.length; i++) {
            str = allBranches[i].str;
            ch = allBranches[i].ch;
            if (str[0] === this.startKnot) {
                if (ch === this.endKnot) {
                    arr.push(allBranches[i]);
                } else if (str[str.length - 1] === this.endKnot && ch === '') {
                    arr.push(allBranches[i]);
                }
            }
        }
        branches = this.getShortBranches(arr);
        this.killRepeatBranch(branches);
        this.branches = branches;
    }

    getShortBranch(branch) {
        const branchNew = {};
        if (branch.ch === '') {
            return {
                str: branch.str, sum: branch.sum
            };
        }
        const str = branch.str;
        const ch = branch.ch;
        branchNew.str = str.substring(0, str.indexOf(ch) + 1);
        branchNew.sum = branch.sum;
        return branchNew;
    }

    getShortBranches(branches) {
        const branchesNew = [];
        for (let i = 0; i < branches.length; i++) {
            branchesNew[i] = this.getShortBranch(branches[i]);
        }
        return branchesNew;
    }

    killRepeatBranch(branches) {
        for (let i = 1; i < branches.length; i++) {
            if (branches[i].str === branches[i - 1].str) {
                branches.splice(i, 1);
                i--;
            }
        }
    }

    getBranchesMinSum(branches) {
        if (branches[0]) {
            let min = branches[0].sum;
            let branch = branches[0];
            for (let i = 1; i < branches.length; i++) {
                if (branches[i].sum < min) {
                    min = branches[i].sum;
                    branch = branches[i];
                }
            }
            return branch;
        }
    }

    getBranchesDefLength(branches, length) {
        const arr = [];
        for (let i = 0; i < branches.length; i++) {
            if (branches[i].str.length === length) {
                arr.push(branches[i]);
            }
        }
        return arr;
    }

    getBranchesDiffLength(branches) {
        const arr = [];
        for (let i = 2; i < branches.length; i++) {
            let branchesDefLength = this.getBranchesDefLength(branches, i);
            if (branchesDefLength) {
                let mBranches = this.getBranchesMinSum(branchesDefLength);
                if (mBranches) {
                    arr.push(mBranches);
                }
            }
        }
        return arr;
    }

    getBranchesOfStr(str) {
        const allBranches = this.getAllBranches();
        let arr = [];
        for (let i = 0; i < allBranches.length; i++) {
            if (allBranches[i].str.match(str)) {
                arr.push(allBranches[i]);
            }
        }
        arr = this.getShortBranches(arr);
        return arr;
    }
}


const data = [
    {
        name: 'A',
        value: 0,
        coords: {
            x: 0,
            y: 0
        },
        connects: {
            'A': undefined,
            'B': 4,
            'C': 2,
            'D': 8,
            'E': 3,
            'F': 15
        }
    },
    {
        name: 'B',
        value: 0,
        coords: {
            x: 0,
            y: 0
        },
        connects:
            {
                'A': 4,
                'B': undefined,
                'C': -1,
                'D': undefined,
                'E': 6,
                'F': 18
            }
    },
    {
        name: 'C',
        value: 0,
        coords: {
            x: 0,
            y: 0
        },
        connects: {
            'A': 4,
            'B': 1,
            'C': undefined,
            'D': undefined,
            'E': -2,
            'F': 14
        }
    },
    {
        name: 'D',
        value: 0,
        coords: {
            x: 0,
            y: 0
        },
        connects: {
            'A': 6,
            'B': undefined,
            'C': 8,
            'D': undefined,
            'E': -2,
            'F': 0
        }
    },
    {
        name: 'E',
        value: 0,
        coords: {
            x: 0,
            y: 0
        },
        connects: {
            'A': 5,
            'B': undefined,
            'C': -2,
            'D': 3,
            'E': undefined,
            'F': -4
        }
    },
    {
        name: 'F',
        value: 0,
        coords: {
            x: 0,
            y: 0
        },
        connects: {
            'A': 5,
            'B': undefined,
            'C': -2,
            'D': 3,
            'E': 6,
            'F': undefined
        }
    }
];

let canvasHeight = 300;
let canvasWidth = 560;

let coords = [
    {x: 334, y: 92},
    {x: 197, y: 200},
    {x: 273, y: 211},
    {x: 89, y: 130},
    {x: 121, y: 50},
    {x: 288, y: 44}
];
for (let i = 0; i < data.length; i++) {
    data[i].coords = coords[i];
}

const graph = new Graph(data);