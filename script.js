let powerOn = false;
const sequence = [];
let userSequence = [];
let level = 1;
let playerName = '';
const levelCount = document.querySelector('.level-count');
const recordCount = document.querySelector('.record-count');
const currentPlayerDisplay = document.getElementById('current-player');
const playerNameInput = document.getElementById('player-name');
const recordList = document.getElementById('record-list');
const restartBtn = document.getElementById('restart-btn');

// Звуковые файлы
const sounds = {
    1: new Audio('najatie-na-kompyuternuyu-knopku1.mp3'),
    2: new Audio('najatie-na-kompyuternuyu-knopku1.mp3'),
    3: new Audio('najatie-na-kompyuternuyu-knopku1.mp3'),
    4: new Audio('najatie-na-kompyuternuyu-knopku1.mp3'),
    surprise: new Audio('rick-rolled-meme-aetrim1602054550919.mp3')
};

// Громкость
Object.values(sounds).forEach(sound => sound.volume = 0.5);

function startGame() {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Пожалуйста, введите свое имя, чтобы начать игру.');
        return;
    }

    sequence.length = 0;
    userSequence.length = 0;
    level = 1;
    levelCount.textContent = level;
    powerOn = true;
    restartBtn.style.display = 'none';
    currentPlayerDisplay.textContent = playerName;
    updateRecordDisplay();
    displayAllRecords();
    nextRound();
}

function nextRound() {
    userSequence = [];
    addToSequence();
    playSequence();
}

function addToSequence() {
    const randomColor = Math.floor(Math.random() * 4) + 1;
    sequence.push(randomColor);
}

function playSequence() {
    disableButtons();
    let i = 0;
    const intervalId = setInterval(() => {
        highlightButton(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(intervalId);
            enableButtons();
        }
    }, 800);
}

function handleClick(button) {
    if (!powerOn) return;
    const userColor = button.getAttribute("data-color");
    userSequence.push(Number(userColor));
    highlightButton(userColor);
    playSound(userColor);

    if (!checkSequence()) {
        alert(`Игра окончена! Ваш итоговый счет: ${level}.`);
        updateRecord();
        togglePower();
    } else if (userSequence.length === sequence.length) {
        level++;
        levelCount.textContent = level;

        // Запуск изменения цвета фона на уровне 3
        if (level === 3) {
            changeBackgroundColor();
        }

        // Рик Ролл
        if (level === 4) {
            sounds.surprise.play();
        }

        setTimeout(() => nextRound(), 1000);
    }
}

function changeBackgroundColor() {
    // Плавный переход цвета фона к черному
    document.body.style.transition = 'background-color 1s ease-in-out';
    document.body.style.backgroundColor = '#000'; 

    // Исходный
    setTimeout(() => {
        document.body.style.backgroundColor = '#f4f4f4'; 
    }, 2000);
}

function checkSequence() {
    return userSequence.every((val, index) => val === sequence[index]);
}

function highlightButton(color) {
    const button = document.querySelector(`[data-color="${color}"]`);
    button.style.opacity = '0.6';
    setTimeout(() => button.style.opacity = '1', 400);
}

function playSound(color) {
    if (sounds[color]) {
        sounds[color].currentTime = 0;
        sounds[color].play().catch(error => {
            console.error('Ошибка при воспроизведении звука:', error);
        });
    }
}

function enableButtons() {
    document.querySelectorAll('.simon-btn').forEach(button => button.removeAttribute('disabled'));
}

function disableButtons() {
    document.querySelectorAll('.simon-btn').forEach(button => button.setAttribute('disabled', 'true'));
}

function togglePower() {
    powerOn = false;
    sequence.length = 0;
    userSequence.length = 0;
    levelCount.textContent = '-';
    disableButtons();
    restartBtn.style.display = 'none';
}

function updateRecord() {
    const records = getRecords();
    const currentRecord = records[playerName] || 0;

    if (level > currentRecord) {
        records[playerName] = level;
        localStorage.setItem('simonGameRecords', JSON.stringify(records));
        alert(`Новый рекорд для ${playerName}: ${level}!`);
    }
    updateRecordDisplay();
    displayAllRecords();
}

function updateRecordDisplay() {
    const records = getRecords();
    const currentRecord = records[playerName] || 0;
    recordCount.textContent = currentRecord;
}

function getRecords() {
    const records = localStorage.getItem('simonGameRecords');
    return records ? JSON.parse(records) : {};
}

function displayAllRecords() {
    const records = getRecords();
    recordList.innerHTML = '';
    for (const [player, score] of Object.entries(records)) {
        const recordItem = document.createElement('li');
        recordItem.textContent = `${player}: ${score}`;
        recordList.appendChild(recordItem);
    }
}
