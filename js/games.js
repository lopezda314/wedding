document.addEventListener('DOMContentLoaded', () => {
    const gameModal = document.getElementById('game-modal');
    const closeModal = document.querySelector('.close-button');
    const gameGrid = document.querySelector('.game-grid');
    const gameContainer = document.getElementById('game-container');
    const gameTemplates = document.getElementById('game-templates');

    if (gameGrid) {
        gameGrid.addEventListener('click', (e) => {
            const gameItem = e.target.closest('.game-item');
            if (gameItem) {
                const gameId = gameItem.dataset.game;
                const gameTemplate = document.getElementById(`${gameId}-template`);
                if (gameTemplate) {
                    gameContainer.innerHTML = gameTemplate.innerHTML;
                    gameModal.style.display = 'block';
                    // Initialize the game
                    initGame(gameId);
                }
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            gameModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            gameModal.style.display = 'none';
        }
    });

    function initGame(gameId) {
        switch (gameId) {
            case 'spelling-bee':
                initSpellingBee();
                break;
            case 'wordle':
                initWordle();
                break;
            case 'crossword-mini':
                initCrosswordMini();
                break;
            case 'connections':
                initConnections();
                break;
            case 'dino-game':
                initDinoGame();
                break;
            case 'crossword':
                initCrosswordMini(); // Using the mini version as a prototype
                break;
        }
    }

    function initDinoGame() {
        const canvas = document.getElementById('dino-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let bike = { x: 50, y: 150, width: 20, height: 20, dy: 0, gravity: 0.6, jumpPower: -10, onGround: true };
        let obstacles = [];
        let score = 0;
        let frame = 0;
        let gameLoop;

        function drawBike() {
            ctx.fillStyle = 'black';
            ctx.fillRect(bike.x, bike.y, bike.width, bike.height);
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                ctx.fillStyle = 'red';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        }

        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, 10, 20);
        }

        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Bike physics
            if (!bike.onGround) {
                bike.dy += bike.gravity;
                bike.y += bike.dy;
            }

            if (bike.y + bike.height >= canvas.height) {
                bike.y = canvas.height - bike.height;
                bike.dy = 0;
                bike.onGround = true;
            }

            // Obstacles
            frame++;
            if (frame % 100 === 0) {
                obstacles.push({ x: canvas.width, y: 150, width: 20, height: 20 });
            }

            obstacles.forEach((obstacle, index) => {
                obstacle.x -= 4;
                if (obstacle.x + obstacle.width < 0) {
                    obstacles.splice(index, 1);
                    score++;
                }

                // Collision detection
                if (
                    bike.x < obstacle.x + obstacle.width &&
                    bike.x + bike.width > obstacle.x &&
                    bike.y < obstacle.y + obstacle.height &&
                    bike.y + bike.height > obstacle.y
                ) {
                    alert(`Game Over! Your score: ${score}`);
                    cancelAnimationFrame(gameLoop);
                }
            });

            drawBike();
            drawObstacles();
            drawScore();

            gameLoop = requestAnimationFrame(update);
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && bike.onGround) {
                bike.dy = bike.jumpPower;
                bike.onGround = false;
            }
        });

        update();
    }

    function initWordle() {
        const wordleGrid = document.getElementById('wordle-grid');
        const wordleKeyboard = document.getElementById('wordle-keyboard');
        const secretWord = 'DAVID'; // Placeholder
        const numGuesses = 6;
        let currentRow = 0;
        let currentCol = 0;
        let guess = '';

        // Create grid
        for (let i = 0; i < numGuesses; i++) {
            const row = document.createElement('div');
            row.classList.add('wordle-row');
            for (let j = 0; j < secretWord.length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('wordle-cell');
                row.appendChild(cell);
            }
            wordleGrid.appendChild(row);
        }

        // Create keyboard
        const keys = [
            'QWERTYUIOP',
            'ASDFGHJKL',
            'ZXCVBNM'
        ];
        keys.forEach(keyRow => {
            const row = document.createElement('div');
            row.classList.add('keyboard-row');
            for (const key of keyRow) {
                const keyElement = document.createElement('button');
                keyElement.classList.add('key');
                keyElement.textContent = key;
                keyElement.addEventListener('click', () => handleKeyPress(key));
                row.appendChild(keyElement);
            }
            wordleKeyboard.appendChild(row);
        });

        function handleKeyPress(key) {
            if (key === 'ENTER') {
                if (guess.length === secretWord.length) {
                    checkGuess();
                }
            } else if (key === 'BACKSPACE') {
                if (guess.length > 0) {
                    guess = guess.slice(0, -1);
                    currentCol--;
                    updateGrid();
                }
            } else if (guess.length < secretWord.length) {
                guess += key;
                updateGrid();
                currentCol++;
            }
        }

        function updateGrid() {
            const row = wordleGrid.children[currentRow];
            for (let i = 0; i < secretWord.length; i++) {
                row.children[i].textContent = guess[i] || '';
            }
        }

        function checkGuess() {
            const row = wordleGrid.children[currentRow];
            for (let i = 0; i < secretWord.length; i++) {
                const cell = row.children[i];
                if (guess[i] === secretWord[i]) {
                    cell.classList.add('correct');
                } else if (secretWord.includes(guess[i])) {
                    cell.classList.add('present');
                } else {
                    cell.classList.add('absent');
                }
            }

            if (guess === secretWord) {
                alert('You win!');
            } else {
                currentRow++;
                currentCol = 0;
                guess = '';
                if (currentRow === numGuesses) {
                    alert(`You lose! The word was ${secretWord}`);
                }
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key.match(/^[a-zA-Z]$/)) {
                handleKeyPress(e.key.toUpperCase());
            } else if (e.key === 'Enter') {
                handleKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                handleKeyPress('BACKSPACE');
            }
        });
    }

    function initSpellingBee() {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
        const centerLetter = 'G';
        const validWords = ['CAGE', 'FADE', 'GEAR', 'BADGE']; // Placeholder

        const letterButtons = document.querySelectorAll('.sb-letter');
        const input = document.getElementById('sb-input');
        const enterButton = document.getElementById('sb-enter');
        const wordList = document.getElementById('sb-word-list');
        const scoreDisplay = document.getElementById('sb-score');
        const feedback = document.querySelector('.sb-feedback');
        let score = 0;
        let foundWords = [];

        // Populate letters
        const allLetters = [...letters, centerLetter];
        const buttons = Array.from(letterButtons);
        const centerIndex = 3; // Assuming the center button is the 4th one
        buttons.splice(centerIndex, 0, buttons.splice(buttons.findIndex(b => b.parentElement.classList.contains('sb-center')), 1)[0]);
        buttons.forEach((button, i) => {
            const letter = i === centerIndex ? centerLetter : letters.pop();
            button.textContent = letter;
            button.addEventListener('click', () => {
                input.value += letter;
            });
        });

        enterButton.addEventListener('click', () => {
            const word = input.value.toUpperCase();
            if (word.length < 4) {
                showFeedback('Too short');
            } else if (!word.includes(centerLetter.toUpperCase())) {
                showFeedback('Missing center letter');
            } else if (foundWords.includes(word)) {
                showFeedback('Already found');
            } else if (isValidWord(word)) {
                foundWords.push(word);
                wordList.innerHTML += `<li>${word}</li>`;
                score += word.length;
                scoreDisplay.textContent = score;
                input.value = '';
                showFeedback('Good!');
            } else {
                showFeedback('Not in word list');
            }
        });

        function isValidWord(word) {
            return validWords.includes(word);
        }

        function showFeedback(message) {
            feedback.textContent = message;
            setTimeout(() => {
                feedback.textContent = '';
            }, 1500);
        }
    }

    function initCrosswordMini() {
        const gridElement = document.getElementById('crossword-mini-grid');
        const acrossCluesList = document.getElementById('across-clues');
        const downCluesList = document.getElementById('down-clues');

        const puzzle = {
            grid: [
                ['A', 'B', 'C', '', 'D'],
                ['E', '', 'F', '', 'G'],
                ['H', 'I', 'J', 'K', 'L'],
                ['M', '', 'N', '', 'O'],
                ['P', 'Q', 'R', 'S', 'T']
            ],
            clues: {
                across: [
                    { num: 1, clue: 'Clue 1 Across' },
                    { num: 4, clue: 'Clue 4 Across' },
                    { num: 5, clue: 'Clue 5 Across' },
                    { num: 6, clue: 'Clue 6 Across' },
                    { num: 7, clue: 'Clue 7 Across' }
                ],
                down: [
                    { num: 1, clue: 'Clue 1 Down' },
                    { num: 2, clue: 'Clue 2 Down' },
                    { num: 3, clue: 'Clue 3 Down' },
                    { num: 4, clue: 'Clue 4 Down' }
                ]
            }
        };

        // Create grid
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = document.createElement('div');
                cell.classList.add('crossword-cell');
                if (puzzle.grid[r][c] === '') {
                    cell.classList.add('black');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = r;
                    input.dataset.col = c;
                    cell.appendChild(input);
                }
                gridElement.appendChild(cell);
            }
        }

        // Create clues
        puzzle.clues.across.forEach(clue => {
            const li = document.createElement('li');
            li.textContent = `${clue.num}. ${clue.clue}`;
            acrossCluesList.appendChild(li);
        });
        puzzle.clues.down.forEach(clue => {
            const li = document.createElement('li');
            li.textContent = `${clue.num}. ${clue.clue}`;
            downCluesList.appendChild(li);
        });
    }

    function initConnections() {
        const gridElement = document.getElementById('connections-grid');
        const submitButton = document.getElementById('connections-submit');
        const groups = [
            { category: 'Fish', words: ['Bass', 'Flounder', 'Salmon', 'Trout'] },
            { category: 'Musical Instruments', words: ['Piano', 'Guitar', 'Violin', 'Drum'] },
            { category: 'Colors', words: ['Red', 'Blue', 'Green', 'Yellow'] },
            { category: 'Planets', words: ['Earth', 'Mars', 'Jupiter', 'Saturn'] }
        ];
        let words = groups.flatMap(g => g.words);
        let selectedWords = [];

        // Shuffle words
        words.sort(() => Math.random() - 0.5);

        // Create grid
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('connection-word');
            wordElement.textContent = word;
            wordElement.addEventListener('click', () => {
                if (selectedWords.includes(word)) {
                    selectedWords = selectedWords.filter(w => w !== word);
                    wordElement.classList.remove('selected');
                } else if (selectedWords.length < 4) {
                    selectedWords.push(word);
                    wordElement.classList.add('selected');
                }
            });
            gridElement.appendChild(wordElement);
        });

        submitButton.addEventListener('click', () => {
            if (selectedWords.length === 4) {
                const correctGroup = groups.find(g => g.words.every(w => selectedWords.includes(w)));
                if (correctGroup) {
                    alert(`Correct! Category: ${correctGroup.category}`);
                    selectedWords.forEach(word => {
                        const el = Array.from(gridElement.children).find(child => child.textContent === word);
                        el.classList.add('correct');
                    });
                    selectedWords = [];
                } else {
                    alert('Incorrect group.');
                }
            }
        });
    }
});