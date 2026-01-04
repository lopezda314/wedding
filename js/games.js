document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnWXjFefXsSW45bEYuC32qut0yj3H_7P63VIlh8GfQjWflRY_zUXxT_cc-rBGGu8_MEw/exec';
    // --- END CONFIGURATION ---

    function gateGames() {
        const guestName = localStorage.getItem('guestName');
        const isGamesPage = window.location.pathname.endsWith('games.html');

        if (isGamesPage) {
            const namePromptContainer = document.getElementById('name-prompt-container');
            const gamesContainer = document.getElementById('games-container');

            if (guestName) {
                gamesContainer.style.display = 'block';
            } else {
                namePromptContainer.style.display = 'block';
                const namePromptForm = document.getElementById('name-prompt-form');
                namePromptForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nameInput = document.getElementById('guest-name-input');
                    const guestName = nameInput.value.trim();
                    if (guestName) {
                        localStorage.setItem('guestName', guestName);
                        namePromptContainer.style.display = 'none';
                        gamesContainer.style.display = 'block';
                    }
                });
            }
        } else {
            if (!guestName) {
                window.location.href = 'games.html';
            }
        }
    }

    function recordHighScore(game, score) {
        let guestName = localStorage.getItem('guestName');

        if (!guestName) {
            guestName = prompt("Please enter your full name to record your high score. This should be the same name you used to RSVP.");
            if (!guestName) {
                alert("High score not recorded. A name is required.");
                return;
            }
            localStorage.setItem('guestName', guestName);
        }

        const data = {
            GuestName: guestName,
        };
        data[game] = game;
        data[game + 'Score'] = score;

        // Using a FormData object to send the data
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    if (game === 'SpellingBee') {
                        localStorage.setItem('geniusAchieved', 'true');
                    }
                    alert(`Congratulations, ${guestName}! Your high score for ${game} has been recorded.`);
                } else {
                    alert("There was an error recording your high score. Please try again.");
                    console.error('Error recording high score:', data.message);
                }
            })
            .catch(error => {
                alert("There was an error recording your high score. Please try again.");
                console.error('Error:', error);
            });
    }

    function init() {
        gateGames();
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
        if (document.getElementById('leaderboard')) {
            initLeaderboard();
        }
    }

    // Helper function to fetch top 3 scores for a single game
    async function getGameScores(gameName) {
        const promises = [];
        // We request all 3 leaders for this game in parallel
        for (let i = 1; i <= 3; i++) {
            const leaderKey = `${gameName}Leader${i}`;
            // Create a promise for each fetch
            const p = fetch(`${SCRIPT_URL}?name=${leaderKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        return {
                            name: data.guestData.LeaderboardName,
                            score: data.guestData.LeaderboardScore
                        };
                    }
                    return null;
                })
                .catch(error => {
                    console.error(`Error fetching ${leaderKey}`, error);
                    return null;
                });
            promises.push(p);
        }
        // Wait for all 3 requests to finish and return the array of results
        return Promise.all(promises);
    }

    function initLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = ''; // Clear previous content if any

        const header = document.createElement('h2');
        header.textContent = 'Leaderboard';
        leaderboard.appendChild(header);

        const scoreRow = document.createElement('div');
        scoreRow.classList.add('leaderboard-grid');
        leaderboard.appendChild(scoreRow);

        // Define the games we want to show
        const games = [
            { key: 'SpellingBee', title: 'Spelling Bee' },
            { key: 'Wordle', title: 'Wordle' },
            { key: 'Bike', title: 'Bike Game' },
            { key: 'Connections', title: 'Connections' }
        ];

        // Loop through each game to create its column
        games.forEach(game => {
            // 1. Create the visual structure immediately (so the layout doesn't jump)
            const gameColumn = document.createElement('div');
            const gameTitle = document.createElement('h3');
            gameTitle.textContent = game.title;
            gameColumn.appendChild(gameTitle);

            // Add a temporary loading text
            const loadingIndicator = document.createElement('div');
            loadingIndicator.textContent = 'Loading...';
            loadingIndicator.style.fontSize = '0.8em';
            loadingIndicator.style.color = '#888';
            gameColumn.appendChild(loadingIndicator);

            scoreRow.appendChild(gameColumn);

            // 2. Fetch the data in the background
            getGameScores(game.key).then(scores => {
                // Remove loading text
                loadingIndicator.remove();

                // 3. Render the scores as soon as they arrive
                scores.forEach(entry => {
                    // Only show if valid and score is positive
                    if (entry && entry.score > 0) {
                        const fullName = entry.name;
                        const firstName = fullName.trim().split(' ')[0];
                        const scoreEntry = document.createElement('div');
                        scoreEntry.textContent = `${firstName}: ${entry.score}`;
                        gameColumn.appendChild(scoreEntry);
                    }
                });
            });
        });
    }

    // Function to load data from Google Sheet
    async function loadGameProgress() {
        const guestName = localStorage.getItem('guestName');
        // Safety check: Don't fetch if no name exists
        if (!guestName) {
            console.warn("No guest name found in local storage.");
            return null;
        }

        // FIX 1 & 2: Remove backslash and add encoding
        const url = `${SCRIPT_URL}?name=${encodeURIComponent(guestName)}`;
        console.log("Attempting to fetch:", url); // DEBUG LOG

        const response = await fetch(url);

        // FIX 3: Check if the response was actually successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        try {
            const data = response.json();
            return data;
        } catch (e) {
            // This usually happens if Google returns an HTML error page
            console.error("Server returned non-JSON response"); 
            return null;
        }
    }

    function initDinoGame() {
        const canvas = document.getElementById('dino-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Prevent player from missing game over page.
        const gameOverCooldown = 500;
        let gameOverTimestamp = 0;

        const originalWidth = 600;
        let scale = canvas.offsetWidth / originalWidth;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = 200;
            scale = canvas.offsetWidth / originalWidth;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let highScore = parseInt(localStorage.getItem('dino-high-score')) || 0;
        loadGameProgress().then(cloudData => {
            // Update high score to backend data if it's greater than local score.
            if (cloudData && cloudData.guestData !== undefined) {
                const oldScore = cloudData.guestData.DinoGame;
                if (parseInt(oldScore) > parseInt(highScore)) {
                    localStorage.setItem('dino-high-score', oldScore);
                    highScore = oldScore;
                    drawScore();
                }
            }
        });

        let bike = { x: 10, y: canvas.height - 5, width: 37, height: 20, dy: 0, gravity: 0.4, jumpPower: -10, onGround: true };
        let obstacles = [];
        let score = 0;
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
            ctx.moveTo(0, canvas.height - 5);
            ctx.lineTo(canvas.width, canvas.height - 5);
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
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height * 3 / 8);
            ctx.font = '20px Arial';
            ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height * 5 / 8);
            ctx.fillText('Click to Restart', canvas.width / 2, canvas.height * 7 / 8);
        }

        function drawStartMessage() {
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            if (window.matchMedia("(any-hover:none)").matches) {
                ctx.fillText('Tap to start', canvas.width / 2, canvas.height / 2);
            } else {
                ctx.fillText('Press space to start', canvas.width / 2, canvas.height / 2);
            }
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
                nextObstacleFrame = frame + Math.floor(Math.random() * 120) + 100; // Random time for next obstacle
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
                    gameOverTimestamp = Date.now();
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('dino-high-score', highScore);
                        if (confirm(`Your new high score is ${highScore}! Do you want to record your score? David and Amanda might use your score for a fun activity at the wedding.`)) {
                            recordHighScore('DinoGame', highScore);
                        }
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
            bike = { x: 10, y: canvas.height - 5, width: 37, height: 20, dy: 0, gravity: 0.33, jumpPower: -10, onGround: true };
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

        canvas.addEventListener('pointerdown', () => {
            if (!gameStarted) {
                gameStarted = true;
                update();
            } else if (gameOver) {
                if (Date.now() - gameOverTimestamp > gameOverCooldown) {
                    restart();
                }
            } else {
                jump();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (!gameStarted) {
                    gameStarted = true;
                    update();
                } else if (gameOver) {
                    if (Date.now() - gameOverTimestamp > gameOverCooldown) {
                        restart();
                    }
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
        const tryAgainButton = document.getElementById('wordle-try-again');
        const secretWord = 'ENOKI';
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
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ];
        keys.forEach(keyRow => {
            const row = document.createElement('div');
            row.classList.add('keyboard-row');
            keyRow.forEach(key => {
                const keyElement = document.createElement('button');
                keyElement.classList.add('key');
                if (key == 'BACKSPACE') {
                    keyElement.textContent = "\u232B";
                } else {
                    keyElement.textContent = key;
                }
                if (key === 'ENTER' || key === 'BACKSPACE') {
                    keyElement.classList.add('large');
                }
                keyElement.addEventListener('click', () => handleKeyPress(key));
                row.appendChild(keyElement);
            });
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

        function clearGrid() {
            for (let i = 0; i < wordleGrid.children.length; i++) {
                const row = wordleGrid.children[i];
                for (let j = 0; j < 5; j++) {
                    row.children[j].textContent = '';
                    row.children[j].classList.remove('correct');
                    row.children[j].classList.remove('present');
                    row.children[j].classList.remove('absent');
                }
            }
            currentRow = 0;
            currentCol = 0;
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
                const score = currentRow + 1;
                if (confirm(`You win! Do you want to record your win? David and Amanda might use your score for a fun activity at the wedding.`)) {
                    recordHighScore('Wordle', score);
                }
                // Disable further interaction
                document.removeEventListener('keydown', handleKeyDown);
            } else {
                currentRow++;
                currentCol = 0;
                guess = '';
                // TODO add previous attempts to score
                if (currentRow === numGuesses) {
                    alert(`You lose! Try again to record your score.`);
                    tryAgainButton.classList.remove('hide');
                }
            }
        }

        function handleKeyDown(e) {
            if (e.key.match(/^[a-zA-Z]$/)) {
                handleKeyPress(e.key.toUpperCase());
            } else if (e.key === 'Enter') {
                handleKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                handleKeyPress('BACKSPACE');
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        tryAgainButton.addEventListener('click', () => {
            clearGrid();
            tryAgainButton.classList.add('hide');
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
            "CANNOT",
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
            "TATTOOS",
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
        ]; // Placeholder, 462 points total
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
        const feedback = document.querySelector('.game-feedback');
        const rankLabel = document.querySelector('.sb-rank-label');
        const rankDots = document.querySelectorAll('.sb-rank-dot');
        const rankContainer = document.querySelector('.sb-rank-container');
        const rankPopup = document.getElementById('sb-rank-popup');
        const rankList = document.getElementById('sb-rank-list');
        const closeButton = rankPopup.querySelector('.close-button');

        const ranks = [
            { name: 'Beginner', score: 0 },
            { name: 'Good Start', score: 9 }, // 2%
            { name: 'Moving Up', score: 23 }, // 5%
            { name: 'Good', score: 37 }, // 8%
            { name: 'Solid', score: 55 }, // 12%
            { name: 'Nice', score: 92 }, // 20%
            { name: 'Great', score: 148 }, // 32%
            { name: 'Amazing', score: 231 }, // 50%
            { name: 'Genius', score: 323 }, // 70%
            { name: 'Queen Bee', score: 462 }, // 100%
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

            if (currentRank.name === 'Genius') {
                const geniusAchieved = localStorage.getItem('geniusAchieved');
                if (!geniusAchieved) {
                    if (confirm("You've reached Genius! Do you want to record your achievement? David and Amanda might use your score for a fun activity at the wedding.")) {
                        recordHighScore('SpellingBee', score);
                    }
                } else {
                    if (score >= 428) {
                        if (confirm("Do you want to record your score? David and Amanda might use your score for a fun activity at the wedding.")) {
                            recordHighScore('SpellingBee', score);
                        }
                    } else if (score >= 393) {
                        if (confirm("Do you want to record your score? David and Amanda might use your score for a fun activity at the wedding.")) {
                            recordHighScore('SpellingBee', score);
                        }
                    } else if (score >= 358) {
                        if (confirm("Do you want to record your score? David and Amanda might use your score for a fun activity at the wedding.")) {
                            recordHighScore('SpellingBee', score);
                        }
                    }
                }
            }

            if (currentRank.name === 'Queen Bee') {
                const queenBeeAchieved = localStorage.getItem('queenBeeAchieved');
                if (!queenBeeAchieved) {
                    if (confirm("You've reached Queen Bee! Do you want to record your achievement? David and Amanda might use your score for a fun activity at the wedding.")) {
                        recordHighScore('SpellingBee', score);
                    }
                }
            }
        }

        rankContainer.addEventListener('click', () => {
            const header = rankList.querySelector('.sb-rank-list-header');
            rankList.innerHTML = ''; // Clear previous list
            rankList.appendChild(header);
            ranks.forEach(rank => {
                // Don't show Queen Bee rank in popup.
                if (rank.name === 'Queen Bee') {
                    return;
                }
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
            recordHighScore('SpellingBee', 200);
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
                const points = word.length === 4 ? 1 : word.length;
                foundWords.push(word);
                wordList.innerHTML += `<li>${word}</li>`;
                score += points;
                scoreDisplay.textContent = score;
                showFeedback('Good!', points);
                localStorage.setItem('sb-foundWords', JSON.stringify(foundWords));
                localStorage.setItem('sb-score', score);
                updateRank();
            } else if (validPangramsSet.has(word)) {
                const points = word.length + 7; // Pangrams get +7 bonus
                foundWords.push(word);
                wordList.innerHTML += `<li>${word}</li>`;
                score += points;
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
        const checkButton = document.getElementById('crossword-check');

        const puzzle = {
            solution: [
                ['C', 'Y', 'C', 'L', 'E'],
                ['O', '', 'A', '', 'A'],
                ['M', 'A', 'R', 'R', 'Y'],
                ['P', '', 'I', '', 'L'],
                ['L', 'O', 'V', 'E', 'S']
            ],
            grid: [
                [1, 2, 3, 4, 5],
                [6, '', 7, '', 8],
                [9, 10, 11, 12, 13],
                [14, '', 15, '', 16],
                [17, 18, 19, 20, 21]
            ],
            clues: {
                across: [
                    { num: 1, clue: 'Wedding transport' },
                    { num: 6, clue: 'To get hitched' },
                    { num: 9, clue: 'What this is all about' },
                ],
                down: [
                    { num: 1, clue: 'City where it all started' },
                    { num: 2, clue: 'Where we met' },
                    { num: 3, clue: 'Country of the proposal' },
                    { num: 4, clue: 'Last name of the bride' },
                    { num: 5, clue: 'Last name of the groom' }
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

        checkButton.addEventListener('click', () => {
            let isCorrect = true;
            const inputs = gridElement.querySelectorAll('input');
            inputs.forEach(input => {
                const r = input.dataset.row;
                const c = input.dataset.col;
                if (input.value.toUpperCase() !== puzzle.solution[r][c]) {
                    isCorrect = false;
                    input.style.backgroundColor = '#ffdddd';
                } else {
                    input.style.backgroundColor = '#ddffdd';
                }
            });

            if (isCorrect) {
                if (confirm('You solved the puzzle! Do you want to record your achievement?')) {
                    recordHighScore('CrosswordMini', 'Solved');
                }
            } else {
                alert('Not quite right. Keep trying!');
            }
        });
    }

    function initConnections() {
        const gridElement = document.getElementById('connections-grid');
        const submitButton = document.getElementById('connections-submit');
        const feedback = document.querySelector('.game-feedback');
        const guessDisplay = document.getElementById('connections-guesses');
        const groups = [
            { category: 'Fish', difficulty: 1, words: ['Bass', 'Flounder', 'Salmon', 'Trout'] },
            { category: 'Musical Instruments', difficulty: 2, words: ['Piano', 'Guitar', 'Violin', 'Drum'] },
            { category: 'Colors', difficulty: 3, words: ['Red', 'Blue', 'Green', 'Yellow'] },
            { category: 'Planets', difficulty: 4, words: ['Earth', 'Mars', 'Jupiter', 'Saturn'] }
        ];
        let words = groups.flatMap(g => g.words);
        let selectedWords = [];
        let correctGroups = 0;
        let numGuesses = 0;

        // Shuffle words
        words.sort(() => Math.random() - 0.5);

        // Create grid
        words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('connection-word');
            wordElement.textContent = word;
            wordElement.addEventListener('click', () => {
                if (wordElement.classList.contains('correct')) return;
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
                    showFeedback(`Correct! Category: ${correctGroup.category}`);
                    correctGroups++;
                    selectedWords.forEach(word => {
                        const el = Array.from(gridElement.children).find(child => child.textContent === word);
                        el.classList.add('correct');
                        el.classList.add('correct' + correctGroup.difficulty);
                        el.classList.remove('selected');
                    });
                    selectedWords = [];

                    // TODO keep track of guess count.
                    if (correctGroups === 4) {
                        if (confirm(`You've found all connections! Do you want to record your achievement?`)) {
                            recordHighScore('Connections', numGuesses);
                        }
                    }
                } else {
                    showFeedback('Incorrect group');
                    // Deselect words.
                    selectedWords.forEach(word => {
                        const el = Array.from(gridElement.children).find(child => child.textContent === word);
                        el.classList.remove('selected');
                    });
                    selectedWords = [];
                }

                // Increase guess count.
                numGuesses++;
                guessDisplay.textContent = numGuesses;
            }
        });

        function showFeedback(message) {
            feedback.textContent = message;
            feedback.classList.add('fade-in');

            setTimeout(() => {
                feedback.classList.remove('fade-in');
                feedback.classList.add('fade-out');
            }, 1200);

            setTimeout(() => {
                feedback.textContent = '';
                feedback.classList.remove('fade-out');
            }, 1500);
        };
    }

    init();
});
