document.addEventListener('DOMContentLoaded', () => {

    function init() {
        if (document.getElementById('spelling-bee-template')) {
            initSpellingBee();
        }
        if (document.getElementById('wordle-template')) {
            initWordle();
        }
        if (document.getElementById('crossword-mini-template')) {
            initCrosswordMini();
        }
        if (document.getElementById('connections-template')) {
            initConnections();
        }
        if (document.getElementById('dino-game-template')) {
            initDinoGame();
        }
    }

    function initDinoGame() {
        const canvas = document.getElementById('dino-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const originalWidth = 600;
        let scale = canvas.offsetWidth / originalWidth;

        let bike = { x: 10, y: canvas.height - 5, width: 37, height: 20, dy: 0, gravity: 0.35, jumpPower: -9, onGround: true };
        let obstacles = [];
        let score = 0;
        let highScore = localStorage.getItem('dino-high-score') || 0;
        let frame = 0;
        let nextObstacleFrame = 100;
        let gameLoop;
        let gameOver = false;
        let gameStarted = false;
        const bikeImage = new Image();
        bikeImage.src = 'https://res.cloudinary.com/duk0nthsi/image/upload/v1754954198/pixil-frame-0_1_xh7orx.png';
        const carImage = new Image();
        carImage.src = 'https://res.cloudinary.com/duk0nthsi/image/upload/v1754953915/pixil-frame-0_2_gitdvl.png';
        const truckImage = new Image();
        truckImage.src = 'https://res.cloudinary.com/duk0nthsi/image/upload/v1754954758/pixil-frame-0_3_ztxngy.png';

        function drawBike() {
            ctx.drawImage(bikeImage, bike.x, bike.y, bike.width, bike.height);
        }

        function drawRoad() {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height-5);
            ctx.lineTo(canvas.width, canvas.height-5);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                let image = obstacle.type === 'car' ? carImage : truckImage;
                ctx.drawImage(image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        }

        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = `${20 * scale}px Arial`;
            ctx.textAlign = 'left';
            ctx.fillText(`Score: ${score}`, 10, 20);
            ctx.textAlign = 'right';
            ctx.fillText(`High Score: ${highScore}`, canvas.width - 10, 20);
        }

        function drawGameOver() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = `${40 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height * 3 / 8);
            ctx.font = `${20 * scale}px Arial`;
            ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height * 5 / 8);
            ctx.fillText('Click to Restart', canvas.width / 2, canvas.height * 7 / 8);
        }

        function drawStartMessage() {
            ctx.fillStyle = 'black';
            ctx.font = `${30 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('Press space to start', canvas.width / 2, canvas.height / 2);
            drawRoad();
        }

        function update() {
            if (!gameStarted) {
                drawStartMessage();
                return;
            }

            if (gameOver) {
                drawGameOver();
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Bike physics
            if (!bike.onGround) {
                bike.dy += bike.gravity;
                bike.y += bike.dy;
            }

            if (bike.y + bike.height >= (canvas.height - 5)) {
                bike.y = (canvas.height - 5) - bike.height;
                bike.dy = 0;
                bike.onGround = true;
            }

            // Obstacles
            frame++;
            if (frame > nextObstacleFrame) {
                let type = Math.random() < 0.5 ? 'car' : 'truck';
                if (type === 'car') {
                    obstacles.push({ x: canvas.width, y: canvas.height - 20, width: 29, height: 15, type: 'car' });
                } else {
                    obstacles.push({ x: canvas.width, y: canvas.height - 25, width: 40, height: 20, type: 'truck' });
                }
                nextObstacleFrame = frame + Math.floor(Math.random() * 120) + 80; // Random time for next obstacle
            }

            obstacles.forEach((obstacle, index) => {
                obstacle.x -= 2;
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
                    gameOver = true;
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('dino-high-score', highScore);
                    }
                }
            });

            drawBike();
            drawObstacles();
            drawScore();
            drawRoad();

            gameLoop = requestAnimationFrame(update);
        }

        function restart() {
            bike = { x: 10, y: canvas.height - 5, width: 37, height: 20, dy: 0, gravity: 0.35, jumpPower: -9, onGround: true };
            obstacles = [];
            score = 0;
            frame = 0;
            nextObstacleFrame = 100;
            gameOver = false;
            update();
        }

        function jump() {
            if (bike.onGround) {
                bike.dy = bike.jumpPower;
                bike.onGround = false;
            }
        }

        canvas.addEventListener('click', () => {
            if (gameOver) {
                restart();
            } else {
                jump();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (!gameStarted) {
                    gameStarted = true;
                    update();
                } else {
                    jump();
                }
            }
        });

        bikeImage.onload = () => {
            drawStartMessage();
        };
    }

    function initWordle() {
        const wordleGrid = document.getElementById('wordle-grid');
        const wordleKeyboard = document.getElementById('wordle-keyboard');
        const secretWord = 'CYCLE';
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
            'ENTER,Z,X,C,V,B,N,M,BACKSPACE'
        ];
        keys.forEach(keyRow => {
            const row = document.createElement('div');
            row.classList.add('keyboard-row');
            const keyArr = keyRow.split(',');
            for (const key of keyArr) {
                const keyElement = document.createElement('button');
                keyElement.classList.add('key');
                keyElement.textContent = key;
                if (key === 'ENTER' || key === 'BACKSPACE') {
                    keyElement.classList.add('large');
                }
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
            const secretWordLetters = secretWord.split('');
            const guessLetters = guess.split('');
            const correctIndices = [];

            // First pass: find correct letters
            for (let i = 0; i < secretWord.length; i++) {
                if (guessLetters[i] === secretWordLetters[i]) {
                    row.children[i].classList.add('correct');
                    correctIndices.push(i);
                }
            }

            // Second pass: find present and absent letters
            for (let i = 0; i < secretWord.length; i++) {
                if (!correctIndices.includes(i)) {
                    const cell = row.children[i];
                    const letter = guessLetters[i];
                    const secretIndex = secretWordLetters.findIndex((l, index) => l === letter && !correctIndices.includes(index));

                    if (secretIndex !== -1) {
                        cell.classList.add('present');
                        // To avoid double counting, we can mark this letter as used in the secret word copy
                        secretWordLetters[secretIndex] = null;
                    } else {
                        cell.classList.add('absent');
                    }
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
        const letters = ['T', 'S', 'C', 'A', 'N', 'U'];
        const centerLetter = 'O';
        const validWords = [
            "ACCOUNTANT",
            "CONSONANT",
            "CONSONANTS",
            "COCONUT",
            "COCONUTS",
            "CONSTANT",
            "CONSTANTS",
            "COUSCOUS",
            "STACCATO",
            "UNCTUOUS",
            "ACCOUNT",
            "CONCOCT",
            "CONCOCTS",
            "CONCUSS",
            "CONTACT",
            "CONTACTS",
            "OUTCAST",
            "OUTCASTS",
            "ACCOST",
            "ACCOSTS",
            "CANNON",
            "CANNONS",
            "CANON",
            "COCOON",
            "COCOONS",
            "COTTON",
            "CUTOUTS",
            "CUTOUT",
            "SONATA",
            "STUCCO",
            "STUCCOS",
            "TATTOO",
            "TOUCAN",
            "ASCOT",
            "ASCOTS",
            "CACAO",
            "COAST",
            "COASTS",
            "COCOA",
            "COSTS",
            "COUNTS",
            "COUNT",
            "SCOOT",
            "SCOOTS",
            "SCOUTS",
            "SCOUT",
            "SNOUT",
            "SNOUTS",
            "STOAT",
            "STOATS",
            "STOUT",
            "STOUTS",
            "TOAST",
            "TOASTS",
            "ANON",
            "AUTO",
            "COAT",
            "COATS",
            "COST",
            "COOT",
            "COOTS",
            "NOON",
            "NOUN",
            "NOUNS",
            "ONTO",
            "ONUS",
            "OUST",
            "SNOT",
            "SOOT",
            "SOON",
            "TACO",
            "TACOS",
            "TONS",
            "TOON",
            "TOOT",
            "TOOTS",
            "TOSS",
            "TOUT",
            "TOUTS",
            "UNTO",
        ]; // Placeholder
        const validWordsSet = new Set(validWords.map(word => word.toUpperCase()));

        const validPangrams = [
            "ACCOUNTANTS",
            "ACCOUNTS",
            "TOUCANS",
        ]
        const validPangramsSet = new Set(validPangrams.map(word => word.toUpperCase()));

        const hexes = document.querySelectorAll('.sb-hex');
        const letterButtons = document.querySelectorAll('.sb-letter');
        const input = document.getElementById('sb-input');
        const enterButton = document.getElementById('sb-enter');
        const deleteButton = document.getElementById('sb-delete');
        const shuffleButton = document.getElementById('sb-shuffle');
        const wordList = document.getElementById('sb-word-list');
        const scoreDisplay = document.getElementById('sb-score');
        const feedback = document.querySelector('.sb-feedback');
        const rankLabel = document.querySelector('.sb-rank-label');
        const rankDots = document.querySelectorAll('.sb-rank-dot');
        const rankContainer = document.querySelector('.sb-rank-container');
        const rankPopup = document.getElementById('sb-rank-popup');
        const rankList = document.getElementById('sb-rank-list');
        const closeButton = rankPopup.querySelector('.close-button');

        const ranks = [
            { name: 'Beginner', score: 0 },
            { name: 'Good Start', score: 5 },
            { name: 'Moving Up', score: 13 },
            { name: 'Good', score: 21 },
            { name: 'Solid', score: 40 },
            { name: 'Nice', score: 67 },
            { name: 'Great', score: 107 },
            { name: 'Amazing', score: 134 },
            { name: 'Genius', score: 187 },
        ];

        let score = 0;
        let foundWords = [];

        function updateRank() {
            let currentRank = ranks[0];
            for (let i = ranks.length - 1; i >= 0; i--) {
                if (score >= ranks[i].score) {
                    currentRank = ranks[i];
                    break;
                }
            }

            rankLabel.textContent = currentRank.name;

            rankDots.forEach((dot, i) => {
                if (i <= ranks.indexOf(currentRank)) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        rankContainer.addEventListener('click', () => {
            const header = rankList.querySelector('.sb-rank-list-header');
            rankList.innerHTML = ''; // Clear previous list
            rankList.appendChild(header);
            ranks.forEach(rank => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${rank.name}</span><span>${rank.score}</span>`;
                rankList.appendChild(li);
            });
            rankPopup.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            rankPopup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == rankPopup) {
                rankPopup.style.display = 'none';
            }
        });

        // Load saved data
        const savedWords = localStorage.getItem('sb-foundWords');
        const savedScore = localStorage.getItem('sb-score');

        if (savedWords && savedScore) {
            foundWords = JSON.parse(savedWords);
            score = parseInt(savedScore, 10);

            scoreDisplay.textContent = score;
            foundWords.forEach(word => {
                wordList.innerHTML += `<li>${word}</li>`;
            });
            updateRank();
        }

        // Populate letters
        const buttons = Array.from(letterButtons);
        const centerIndex = 3; // Assuming the center button is the 4th one

        hexes.forEach((hex, i) => {
            const button = hex.querySelector('.sb-letter');
            const letter = i === centerIndex ? centerLetter : letters.pop();
            button.textContent = letter;
            hex.addEventListener('click', (event) => {
                input.value += button.textContent;
            });
        });

        deleteButton.addEventListener('click', () => {
            input.value = input.value.slice(0, -1);
        });

        shuffleButton.addEventListener('click', () => {
            const outerButtons = [];
            buttons.forEach((button, i) => {
                if (i !== centerIndex) {
                    outerButtons.push(button);
                }
            });

            // Add fade-out class
            outerButtons.forEach(button => button.classList.add('fade-out'));

            setTimeout(() => {
                const outerLetters = outerButtons.map(button => button.textContent);

                // Shuffle the outer letters
                for (let i = outerLetters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [outerLetters[i], outerLetters[j]] = [outerLetters[j], outerLetters[i]];
                }

                outerButtons.forEach((button, i) => {
                    button.textContent = outerLetters[i];
                });

                // Add fade-in class and remove fade-out
                outerButtons.forEach(button => {
                    button.classList.remove('fade-out');
                    button.classList.add('fade-in');
                });

                // Clean up fade-in class after animation
                setTimeout(() => {
                    outerButtons.forEach(button => {
                        button.classList.remove('fade-in');
                    });
                }, 200);
            }, 200);
        });

        enterButton.addEventListener('click', () => {
            const word = input.value.toUpperCase();
            if (word.length < 4) {
                showFeedback('Too short');
            } else if (!word.includes(centerLetter.toUpperCase())) {
                showFeedback('Missing center letter');
            } else if (foundWords.includes(word)) {
                showFeedback('Already found');
            } else if (validWordsSet.has(word)) {
                const points = word.length;
                foundWords.push(word);
                wordList.innerHTML += `<li>${word}</li>`;
                score += points;
                scoreDisplay.textContent = score;
                showFeedback('Good!', points);
                localStorage.setItem('sb-foundWords', JSON.stringify(foundWords));
                localStorage.setItem('sb-score', score);
                updateRank();
            }  else if (validPangramsSet.has(word)) {
                const points = word.length * 2;
                foundWords.push(word);
                wordList.innerHTML += `<li>${word}</li>`;
                score += points; // Double points for pangrams
                scoreDisplay.textContent = score;
                showFeedback('Pangram!', points);
                localStorage.setItem('sb-foundWords', JSON.stringify(foundWords));
                localStorage.setItem('sb-score', score);
                updateRank();
            } else {
                showFeedback('Not in word list');
            }
            input.value = '';
        });

        function showFeedback(message, points = 0) {
            let feedbackMessage = message;
            if (points > 0) {
                feedbackMessage += ` +${points}`;
            }
            feedback.textContent = feedbackMessage;
            feedback.classList.add('fade-in');

            setTimeout(() => {
                feedback.classList.remove('fade-in');
                feedback.classList.add('fade-out');
            }, 1200);

            setTimeout(() => {
                feedback.textContent = '';
                feedback.classList.remove('fade-out');
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

    init();
});