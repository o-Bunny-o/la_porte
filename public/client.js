document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const playLink = document.getElementById('play-link');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const gameBoard = document.getElementById('game-board');
    const playerInfo = document.getElementById('user-info'); // Use #user-info to make it visible on all tabs
    const logoutButton = document.getElementById('logout-button');

    // Function to display the selected tab and hide others
    function showTab(tabId) {
        tabContents.forEach(content => {
            content.style.display = content.id === tabId ? 'block' : 'none';
        });
        tabLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-tab') === tabId);
        });

        // Display user info if logged in
        if (localStorage.getItem('playerName')) {
            displayPlayerInfo(localStorage.getItem('playerName'), localStorage.getItem('points'));
        }

        // Load statistics when "Statistics" tab is selected
        if (tabId === 'statistics') {
            loadStatistics();
        }
    }

    // Tab click handling
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            if (tabId === 'play' && !localStorage.getItem('playerName')) {
                loginModal.style.display = 'flex';
            } else {
                showTab(tabId);
            }
        });
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
        document.getElementById('login-error').style.display = 'none'; // Clear login error
    });

    // Display player info (name and score)
    function displayPlayerInfo(name, score) {
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-score').textContent = score;
        playerInfo.style.display = 'flex';
    }

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('playerName', data.name);
                localStorage.setItem('points', data.points);
                loginModal.style.display = 'none';
                showTab('play');
                displayPlayerInfo(data.name, data.points); // Display player info
                initializeGame();
            } else {
                document.getElementById('login-error').style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    // Initialize the game board
    async function initializeGame() {
        const response = await fetch('/game/start');
        const gameState = await response.json();
        renderGameBoard(gameState);
        document.addEventListener('keydown', handlePlayerMovement);
    }

    // Render the game board based on the game state
    function renderGameBoard(state) {
        gameBoard.innerHTML = ''; // Clear previous board

        const boardSize = 8; // Updated to 8x8
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                // Assign classes based on game state
                if (state.player.x === x && state.player.y === y) {
                    cell.classList.add('player');
                } else if (state.key.x === x && state.key.y === y) {
                    cell.classList.add('key');
                } else if (state.door && state.door.x === x && state.door.y === y) {
                    cell.classList.add('door');
                } else if (state.enemies.some(enemy => enemy.x === x && enemy.y === y)) {
                    cell.classList.add('enemy');
                }

                gameBoard.appendChild(cell);
            }
        }
    }

    // Handle player movement with game status checks
    async function handlePlayerMovement(event) {
        let direction;
        if (event.key === 'ArrowUp') direction = 'up';
        if (event.key === 'ArrowDown') direction = 'down';
        if (event.key === 'ArrowLeft') direction = 'left';
        if (event.key === 'ArrowRight') direction = 'right';

        if (direction) {
            const playerName = localStorage.getItem('playerName');
            const response = await fetch('/game/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playerName, direction })
            });
            const result = await response.json();

            // Check game status and display messages accordingly
            if (result.status === 'playing') {
                renderGameBoard(result.gameState); // Update game board with new positions
            } else if (result.status === 'won') {
                alert(result.message);
                const newScore = parseInt(localStorage.getItem('points'), 10) + 10;
                localStorage.setItem('points', newScore);
                displayPlayerInfo(localStorage.getItem('playerName'), newScore);
                resetGame();
            } else if (result.status === 'lost') {
                alert(result.message);
                resetGame();
            }
        }
    }

    // Reset the game by reinitializing the game state
    async function resetGame() {
        const playAgain = confirm("Game over! Do you want to play again?");
        if (playAgain) {
            initializeGame(); // Restart the game
        } else {
            showTab('home'); // Return to home tab
        }
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('playerName');
        localStorage.removeItem('points');
        playerInfo.style.display = 'none';
        showTab('home');
    });

    // Function to load and display statistics in the #stats-table
    async function loadStatistics() {
        const response = await fetch('/stats');
        const stats = await response.json();
        const statsTableBody = document.querySelector('#stats-table tbody');
        statsTableBody.innerHTML = ''; // Clear previous stats

        stats.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${player.name}</td><td>${player.points}</td>`;
            statsTableBody.appendChild(row);
        });
    }

    // Show signup form when clicking "Sign Up"
    document.getElementById('signup-button').addEventListener('click', () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('login-error').style.display = 'none'; // Clear login error if shown
    });

    // Handle signup form submission
    document.getElementById('register-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password })
            });
            if (response.ok) {
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                document.getElementById('signup-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            } else {
                alert('Inscription échouée : le nom d\'utilisateur existe peut-être déjà.');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    });

    // Display the Home tab by default
    showTab('home');
});
