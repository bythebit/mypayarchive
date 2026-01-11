document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const scoreElement = document.getElementById('score');
    const touchLeft = document.querySelector('#touch-controls .touch-zone:first-child');
    const touchRight = document.querySelector('#touch-controls .touch-zone:last-child');

    let score = 0;
    let missedApples = 0;
    const maxMissedApples = 3;
    let playerPositionX = gameContainer.offsetWidth / 2;
    const playerSpeed = 15;
    let apples = [];
    let gameLoopId;
    let appleIntervalId;
    let isGameOver = false;

    function setPlayerPosition() {
        const playerWidth = player.offsetWidth;
        const containerWidth = gameContainer.offsetWidth;
        if (playerPositionX < playerWidth / 2) {
            playerPositionX = playerWidth / 2;
        }
        if (playerPositionX > containerWidth - playerWidth / 2) {
            playerPositionX = containerWidth - playerWidth / 2;
        }
        player.style.left = `${playerPositionX}px`;
    }

    function movePlayer(direction) {
        if (isGameOver) return;
        if (direction === 'left') {
            playerPositionX -= playerSpeed;
        } else {
            playerPositionX += playerSpeed;
        }
        setPlayerPosition();
    }

    // Keyboard controls
    const keysPressed = {};
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
        keysPressed[e.key] = false;
    });

    // Touch controls
    let touchingLeft = false;
    let touchingRight = false;
    touchLeft.addEventListener('touchstart', (e) => { e.preventDefault(); touchingLeft = true; });
    touchLeft.addEventListener('touchend', (e) => { e.preventDefault(); touchingLeft = false; });
    touchRight.addEventListener('touchstart', (e) => { e.preventDefault(); touchingRight = true; });
    touchRight.addEventListener('touchend', (e) => { e.preventDefault(); touchingRight = false; });

    function createApple() {
        if (isGameOver) return;
        const apple = document.createElement('div');
        apple.classList.add('apple');
        const containerWidth = gameContainer.offsetWidth;
        apple.style.left = `${Math.random() * (containerWidth - 40)}px`;
        apple.style.top = '-40px';
        
        // 속도와 생성 간격 조절
        let appleSpeed = 5 + Math.floor(score / 10); // 점수가 10점 오를 때마다 속도 증가
        apple.dataset.speed = appleSpeed;

        gameContainer.appendChild(apple);
        apples.push(apple);
    }

    function gameOver() {
        isGameOver = true;
        cancelAnimationFrame(gameLoopId);
        clearInterval(appleIntervalId);
        const gameOverText = document.createElement('div');
        gameOverText.textContent = '게임 오버';
        gameOverText.style.position = 'absolute';
        gameOverText.style.top = '50%';
        gameOverText.style.left = '50%';
        gameOverText.style.transform = 'translate(-50%, -50%)';
        gameOverText.style.fontSize = '48px';
        gameOverText.style.color = 'red';
        gameOverText.style.fontWeight = 'bold';
        gameContainer.appendChild(gameOverText);

        setTimeout(() => {
            gameOverText.remove();
            startGame();
        }, 3000);
    }

    function gameLoop() {
        if (isGameOver) return;

        // Player movement based on continuous press
        if (keysPressed['ArrowLeft'] || touchingLeft) {
            movePlayer('left');
        }
        if (keysPressed['ArrowRight'] || touchingRight) {
            movePlayer('right');
        }

        // Move apples
        for (let i = apples.length - 1; i >= 0; i--) {
            const apple = apples[i];
            let appleTop = parseInt(apple.style.top);
            const appleSpeed = parseInt(apple.dataset.speed);
            appleTop += appleSpeed;
            apple.style.top = `${appleTop}px`;

            const playerRect = player.getBoundingClientRect();
            const appleRect = apple.getBoundingClientRect();

            // Collision detection
            if (appleRect.bottom >= playerRect.top &&
                appleRect.top <= playerRect.bottom &&
                appleRect.right >= playerRect.left &&
                appleRect.left <= playerRect.right) {
                
                score++;
                scoreElement.textContent = `점수: ${score}`;
                apple.remove();
                apples.splice(i, 1);
                
                // 점수에 따라 사과 생성 간격 조절
                clearInterval(appleIntervalId);
                let newInterval = Math.max(200, 1000 - (score * 20));
                appleIntervalId = setInterval(createApple, newInterval);

            } else if (appleTop > window.innerHeight) {
                apple.remove();
                apples.splice(i, 1);
                missedApples++;
                if (missedApples >= maxMissedApples) {
                    gameOver();
                }
            }
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
        isGameOver = false;
        playerPositionX = gameContainer.offsetWidth / 2;
        setPlayerPosition();
        score = 0;
        missedApples = 0;
        scoreElement.textContent = `점수: ${score}`;
        
        apples.forEach(apple => apple.remove());
        apples = [];
        
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        if (appleIntervalId) clearInterval(appleIntervalId);
        
        appleIntervalId = setInterval(createApple, 1000);
        gameLoop();
    }

    startGame();
    window.addEventListener('resize', () => {
        if (!isGameOver) {
            playerPositionX = gameContainer.offsetWidth / 2;
            setPlayerPosition();
        }
    });
});