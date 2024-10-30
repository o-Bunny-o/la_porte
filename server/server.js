/* express server that handles:

       - login requests to authenticate users.
       - game state management for initializing and updating positions.
       - movement updates for player actions and enemy movements. 

*/

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

let users = require('./users.json');
let gameState = require('./game_state.json');

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Helper function to get a random move for enemies
function getRandomMove(x, y) {
    const moves = [
        { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 0 },                { x: 1, y: 0 },
        { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ];
    const move = moves[Math.floor(Math.random() * moves.length)];
    return { x: x + move.x, y: y + move.y };
}

// Login - authenticate user credentials from users.json
app.post('/login', (req, res) => {
    const { name, password } = req.body;
    const user = users.find(u => u.name === name);
    if (user && user.password === password) {
        res.json({ status: 'success', name: user.name, points: user.points });
    } else {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
});

// Signup - Register a new user
app.post('/signup', (req, res) => {
    const { name, password } = req.body;
    const userExists = users.some(u => u.name === name);
    
    if (userExists) {
        return res.status(400).json({ status: 'error', message: 'Username already exists' });
    }
    
    const newUser = { name, password, points: 0 };
    users.push(newUser);

    // Save the new user to users.json
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
    
    res.json({ status: 'success', message: 'User registered successfully' });
});

// Game initialization - returns the initial game state
app.get('/game/start', (req, res) => {
    // Reset game state
    gameState.hasKey = false;  // Player does not have the key initially
    fs.writeFileSync(path.join(__dirname, 'game_state.json'), JSON.stringify(gameState));
    res.json(gameState);
});

// Handle player movement and game state updates
app.post('/game/move', (req, res) => {
    const { name, direction } = req.body;
    const player = gameState.player;
    const gridSize = 8;

    // Update player's position based on direction
    const newPosition = { ...player };
    if (direction === 'up' && player.y > 0) newPosition.y -= 1;
    if (direction === 'down' && player.y < gridSize - 1) newPosition.y += 1;
    if (direction === 'left' && player.x > 0) newPosition.x -= 1;
    if (direction === 'right' && player.x < gridSize - 1) newPosition.x += 1;

    // Update player's position if the move is valid
    player.x = newPosition.x;
    player.y = newPosition.y;

    // Check if player reaches the key
    if (player.x === gameState.key.x && player.y === gameState.key.y) {
        gameState.hasKey = true;  // Mark that the player has the key
    }

    // Move enemies randomly
    gameState.enemies = gameState.enemies.map(enemy => {
        let newEnemyPosition = getRandomMove(enemy.x, enemy.y);

        // Ensure enemy stays within bounds
        newEnemyPosition.x = Math.max(0, Math.min(newEnemyPosition.x, gridSize - 1));
        newEnemyPosition.y = Math.max(0, Math.min(newEnemyPosition.y, gridSize - 1));

        return newEnemyPosition;
    });

    // Check if player collides with an enemy
    const playerDied = gameState.enemies.some(enemy => enemy.x === player.x && enemy.y === player.y);
    if (playerDied) {
        // Reset player to starting position on loss
        gameState.player = { x: gridSize - 1, y: gridSize - 1 }; // Bottom-right corner
        return res.json({ status: 'lost', message: 'Player encountered an enemy and died!' });
    }

    // Check if player reaches the door with the key
    if (gameState.hasKey && player.x === gameState.door.x && player.y === gameState.door.y) {
        const user = users.find(u => u.name === name);
        if (user) user.points += 10;
        fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
        return res.json({ status: 'won', message: 'Congratulations! You escaped with the key and earned 10 points.' });
    }

    // Respond with the updated game state
    res.json({ status: 'playing', gameState });
});


// Statistics - Get all player scores
app.get('/stats', (req, res) => {
    const stats = users.map(user => ({
        name: user.name,
        points: user.points
    }));
    res.json(stats);
});

// Server start - it listens on port 81 & serves files from public.
const PORT = 81;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
