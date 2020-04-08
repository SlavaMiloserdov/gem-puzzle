let box;
let arrayOfBones = [];
let emptyBone;
let timer;
let countOfMoves = 0;
let isStopGame = false;
let isWin = false;

let menu = document.createElement('div');
menu.classList.add('menu');

let buttonPlay = document.createElement('button');
let buttonStop = document.createElement('button');
let buttonSave = document.createElement('button');
let buttonResult = document.createElement('button');

let clicks = 0;

let buttons = [];
buttons.push(buttonPlay);
buttons.push(buttonStop);
buttons.push(buttonSave);
buttons.push(buttonResult);
buttons.forEach(button => button.classList.add('button'));

buttonPlay.classList.add('button_play');
buttonStop.classList.add('button_stop');
buttonSave.classList.add('button_save');
buttonResult.classList.add('button_result');

buttonPlay.textContent = 'Размешать и начать';
buttonStop.textContent = 'Стоп';
buttonSave.textContent = 'Сохранить';
buttonResult.textContent = 'Результаты';

buttons.forEach(button => menu.append(button));

let results = document.createElement('div');
let numberOfMoves = document.createElement('p');
let resultTime = document.createElement('p');

numberOfMoves.textContent = `Ходов:${countOfMoves}`;
resultTime.textContent = `Время:${0}`;

results.classList.add('results');

results.append(numberOfMoves);
results.append(resultTime);

class Bone {
    constructor(position) {
        this.element = document.createElement('button');
        this.element.classList.add('bone');
        if (position < 16) {
            this.position = position;
            this.element.textContent = position;
        } else {
            this.element.classList.add('bone_empty');
        }
    }
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

const boxHandler = (event) => {
    updateBones('move');
}

function swap(array, a, b) {
    array[a] = array.splice(b, 1, array[a])[0];
}

const updateMoves = (modifier) => {
    switch (modifier) {
        case 'increase':
            countOfMoves += 1;
            numberOfMoves.textContent = `Ходов:${countOfMoves}`;
            break;    
            case 'clear':
            countOfMoves = 0;
            numberOfMoves.textContent = `Ходов:${countOfMoves}`;
            break; 
        default:
            break;
    }
}

const getTime = (date) => {
    let currentTime = (Date.now() - date); 
    
    let minutes = Math.floor((currentTime / 1000) / 60);
    let seconds = Math.floor(currentTime / 1000 - minutes * 60);
    resultTime.textContent = `Время: минут ${minutes} : секунд ${seconds}`;
}

const updateTime = (date, modifier) => {  
    if (isStopGame) {
        clearInterval(timer);
        return;
    }
    if (modifier === 'clearTime') {
        clearInterval(timer);
    } 

    timer = setInterval(() => getTime(date), 1000);      
}

const clearArray = (array) => {
 for (let i = 0; i < 16; i += 1) {
     array.pop();
 }
}

const checkWin = () => {
    let tempCheckWinValue = true;    
    for (let i = 0; i < 15; i += 1) {
        if (arrayOfBones[i].position != i + 1) {
            tempCheckWinValue = false;
        }
    }
    
    isWin = tempCheckWinValue;
    if (isWin) {      
        alert(`Ура! Вы решили головоломку за ${resultTime.textContent} и ${countOfMoves} ходов`);
    }
}

function updateBones(modifier) {
    if (isStopGame) {
        return;
    }
    if (modifier === 'play') {
        updateMoves('clear');
        updateTime(new Date, 'clearTime');
        if (arrayOfBones.length) {   
            clearArray(arrayOfBones);
            box.remove();
        }
        box = document.createElement('div');
        box.classList.add('box');
        for (let i = 0; i < 16; i++) {
            let bone = new Bone(i + 1);
            arrayOfBones.push(bone);
        }
        emptyBone = arrayOfBones[arrayOfBones.length - 1];
        shuffle(arrayOfBones);
    }
    if (modifier === 'move') {
        if ((emptyBone.element.offsetLeft + emptyBone.element.offsetWidth === event.target.offsetLeft
            && emptyBone.element.offsetTop === event.target.offsetTop)
            || (emptyBone.element.offsetLeft === event.target.offsetLeft + event.target.offsetWidth
                && emptyBone.element.offsetTop === event.target.offsetTop)
            || (emptyBone.element.offsetLeft === event.target.offsetLeft
                && emptyBone.element.offsetTop + emptyBone.element.offsetHeight === event.target.offsetTop)
            || (emptyBone.element.offsetLeft === event.target.offsetLeft
                && emptyBone.element.offsetTop === event.target.offsetTop + event.target.offsetHeight)) {
            swap(arrayOfBones, arrayOfBones.findIndex(bone => bone.element.textContent === event.target.textContent), arrayOfBones.findIndex(bone => bone === emptyBone));
            updateMoves('increase');
        }
    }

    arrayOfBones.forEach(bone => box.append(bone.element));
    document.body.append(box);
    box.addEventListener('click', boxHandler);
    checkWin();
}

const menuHandler = (event) => {
    switch (event.target.textContent) {
        case buttonPlay.textContent:
            isStopGame = false;
            isWin = false;
            updateBones('play');
            break;
        case buttonStop.textContent:
            isStopGame = true;
            updateTime();
            break;
        case buttonSave.textContent:
            break;
        case buttonResult.textContent:
            break;
        default:
            break;
    }
}

menu.addEventListener('click', menuHandler);

document.body.append(menu);
document.body.append(results);