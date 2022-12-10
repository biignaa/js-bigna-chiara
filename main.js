let gameRunning = false;
let counter = 0;
const explosionSound = new Audio('audio/explosion.wav');
const collectSound = new Audio('audio/collect.wav');
const timer = new Timer(6);
let timerValue = 0;

let bananaCounter;
let collectedBananas;
const wantedBananas = 4; // Diese Anzahl [...] soll gesammelt werden.

let strawberryCounter;
let collectedStrawberries;
const wantedStrawberries = 5;

let appleCounter;
let collectedApples;
const wantedApples = 7;

let player;
let field;
let fieldRightBorder;
let fieldLeftBorder;
let fieldTopBorder;
let fieldBottomBorder;

function startGame() {
    gameRunning = true;
    // Spielfeld anzeigen und Start-Ansicht ausblenden.
    document.querySelector('#game').style.display = 'block';
    document.querySelector('#start-screen').style.display = 'none';

    // Alle Variablen initialisieren. Dies kann erst hier geschehen, da das Spielfeld zu Beginn ausgeblendet ist.
    bananaCounter = document.querySelector('#collected-bananas'); // Der Zähler aus dem HTML, welcher die Anzahl gesammelte Früchte anzeigt.
    collectedBananas = []; // Ein Array, welches alle gesammelten Früchte beinhaltet.

    strawberryCounter = document.querySelector('#collected-strawberries');
    collectedStrawberries = [];

    appleCounter = document.querySelector('#collected-apples');
    collectedApples = [];

    player = document.querySelector('#player');
    player.style.left = '500px';

    // Feld wird initialisiert und die Ränder berechnet.
    field = document.querySelector('#playground');
    fieldRightBorder = screen.width / 2 + field.clientWidth / 2;
    fieldLeftBorder = screen.width / 2 - field.clientWidth / 2;
    fieldTopBorder = screen.height / 2 - field.clientHeight / 2 - 65;
    fieldBottomBorder = screen.height / 2 + field.clientHeight / 2 - 65;

    generateObjects();
    refreshList();
    window.requestAnimationFrame(loop);
}

function loop() {
    /* Wenn gameRunning false ist, kommt das Programm nicht weiter als Zeile 59 und springt zurück.
     Dies ist um zu verhindern, dass obwohl der Endbildschirm schon angezeigt wird, immer noch Früchte oder Pilze
     gesammelt werden und sich dann das Endergebnis ändert. */
     console.log(gameRunning);
    if (!gameRunning) {
        return;
    }

    // Timer für Stoppuhr aufsetzen
    if (timer.ready()) {
        timerValue++;
        document.querySelector('#timer').textContent = timerValue / 10 + 's';
    }

    // Warten bis rechte Pfeiltaste gedrückt wird
    if (keyboard(39)) {
        // Zur Überprüfung, dass sich der Spieler noch im Spielfeld befindet.
        if (parseInt(player.style.left) + 5 + player.clientWidth <= fieldRightBorder) {
            player.style.left = parseInt(player.style.left) + 5 + 'px';
        }
    }
    // Warten bis linke Pfeiltaste gedrückt wird
    if (keyboard(37)) {
        if (parseInt(player.style.left) - 5 >= fieldLeftBorder) {
            player.style.left = parseInt(player.style.left) - 5 + 'px';
        }
    }

    // Alle Früchte vom Spielfeld holen
    let fruits = document.querySelectorAll('.fruit');

    // Auf eine Kollision warten
    let collidedElement = getCollisions(player, fruits)[0];

    // Wenn das kollidierte Objekt eine Pilze war, dann das:
    if (collidedElement && collidedElement.className === 'fruit mushroom') {
        explosionSound.play();
        gameOver();

        // Wenn das kollidierte Objekt eine Frucht war, dann das
    } else if (collidedElement && collidedElement.className === 'fruit') {
        if (collidedElement.src.includes('banana')) {
            collectedBananas.push(collidedElement);
        } else if (collidedElement.src.includes('strawberry')) {
            collectedStrawberries.push(collidedElement);
        } else if (collidedElement.src.includes('apple')) {
            collectedApples.push(collidedElement);
        }

        collectSound.play();

        refreshList();
        checkGameOver();

        // Die eingesammelte Frucht vom Spielfeld entfernen.
        const fruitId = collidedElement.id;
        document.getElementById(fruitId).remove();
    }

    // Gravitation, aber nur solange, wie sich die Frucht im Spielfeld befindet. Ansonsten wird sie entfernt.
    fruits.forEach((fruit) => {
        if (parseInt(fruit.style.top) + 1 + fruit.clientHeight <= fieldBottomBorder) {
            fruit.style.top = parseInt(fruit.style.top) + 1 + 'px';
        } else {
            fruit.remove();
        }
    });

    window.requestAnimationFrame(loop);
}

// Aktualisierung Liste
function refreshList() {
    // Die Anzahl gesammelter Früchte wird aus der Länge des Arrays (mit den gesammelten Früchten drin) ermittelt.
    bananaCounter.textContent = `${collectedBananas.length}/${wantedBananas}`;
    strawberryCounter
.textContent = `${collectedStrawberries.length}/${wantedStrawberries}`;
    appleCounter.textContent = `${collectedApples.length}/${wantedApples}`;
}

// Überprüfung ob Spiel vorbei
function checkGameOver() {
    // Wenn eine Zahl überschritten wurde
    if (collectedBananas.length > wantedBananas ||
        collectedStrawberries.length > wantedStrawberries ||
        collectedApples.length > wantedApples) {
        gameOver();
        gameRunning = false;
    }

    // Wenn man alles benötigte gesammelt hat
    if (collectedBananas.length === wantedBananas &&
        collectedStrawberries.length === wantedStrawberries &&
        collectedApples.length === wantedApples) {
        gameOverWin();
        gameRunning = false;
    }
}

// Früchte generieren
function generateObjects() {
    setInterval(() => {
        let fruit = document.createElement('img');
        fruit.className = 'fruit';
        fruit.width = 40;
        fruit.height = 40;
        fruit.style.top = fieldTopBorder + 'px';
        fruit.id = counter.toString();
        fruit.style.left = getRandom(fieldLeftBorder, fieldRightBorder - fruit.width) + 'px';

        // Zufällige Zahl generieren, um dann die Frucht zu wählen
        const random = Math.round(getRandom(1, 4));
        switch (random) {
            case 1:
                fruit.src = 'img/banana.png';
                break;
            case 2:
                fruit.src = 'img/apple.png';
                break;
            case 3:
                fruit.src = 'img/strawberry.png';
                break;
            case 4:
                fruit.src = 'img/mushroom.png';
                fruit.className = 'fruit mushroom'
                break;
            default:
                fruit.src = 'img/banana.png';
        }

        field.appendChild(fruit);
        counter++;
    }, 1000); // Jede Sekunde
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// Spielfeld ausblenden, Endbild einblenden, Informationen auf Endbild hinzufügen
function endScreen() {
    gameRunning = false;
    let afterGameScreen = document.querySelector('.after-game-screen');
    afterGameScreen.style.display = 'flex';
    let counterWrapper = document.querySelector('#counter-wrapper');
    counterWrapper.style.marginTop = '0px';
    counterWrapper.style.marginLeft = '0px';
    document.querySelector('#counter').appendChild(counterWrapper);
    document.querySelector('#used-time').textContent = `Verstrichene Zeit: ${timerValue / 10}s`;
    document.querySelector('#game').remove();
    return afterGameScreen;
}

// Text zum Gewinner-Endbild hinzufügen
function gameOverWin() {
    const winScreen = endScreen();
    winScreen.querySelector('h1').textContent = 'Gewonnen.';
    winScreen.querySelector('button').textContent = 'nocheinmal';
}

// Text zum Verlierer-Endbild hinzufügen
function gameOver() {
    const gameOverScreen = endScreen();
    gameOverScreen.querySelector('h1').textContent = 'Verloren.';
    gameOverScreen.querySelector('button').textContent = 'erneut versuchen';
}
