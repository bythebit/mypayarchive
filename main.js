document.addEventListener('DOMContentLoaded', () => {
    // --- 기본 설정 ---
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // --- DOM 요소 ---
    const overlay = document.getElementById('game-overlay');
    const startButton = document.getElementById('start-button');
    const titleText = document.getElementById('title-text');
    const gameOverScreen = document.getElementById('game-over-screen');

    // --- 게임 상수 ---
    const GAME_WIDTH = 560;
    const PLAYER_WIDTH = 64;
    const PLAYER_HEIGHT = 64;
    const PLAYER_SPEED = 8;
    const APPLE_WIDTH = 32;
    const APPLE_HEIGHT = 32;
    const GROUND_HEIGHT = 20;
    const INITIAL_SPAWN_INTERVAL = 1200; // 초기 생성 간격

    // --- 에셋 로딩 ---
    const playerImg = new Image();
    const appleImg = new Image();
    const assets = {
        player: { src: 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/72x72/1F9FA.png' },
        apple: { src: 'https://em-content.zobj.net/source/apple/391/red-apple_1f34e.png' }
    };
    let assetsLoaded = 0;
    
    function handleAssetLoad() {
        assetsLoaded++;
        if (assetsLoaded === Object.keys(assets).length) {
            startButton.disabled = false;
            startButton.textContent = 'START';
        }
    }
    playerImg.src = assets.player.src;
    playerImg.onload = handleAssetLoad;
    appleImg.src = assets.apple.src;
    appleImg.onload = handleAssetLoad;

    // --- 게임 상태 변수 ---
    let player, apples, score, keys, gameLoopId, appleIntervalId, isGameOver;

    // --- 함수 ---
    function init() {
        player = { x: (canvas.width - PLAYER_WIDTH) / 2, y: canvas.height - PLAYER_HEIGHT - GROUND_HEIGHT, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
        apples = [];
        score = 0;
        keys = {};
        isGameOver = false;
        if (appleIntervalId) clearInterval(appleIntervalId);
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
    }

    function getSpawnInterval(currentScore) {
        const tier = Math.floor(currentScore / 10);
        const newInterval = INITIAL_SPAWN_INTERVAL * Math.pow(0.8, tier); // 10점마다 20%씩 감소
        return Math.max(newInterval, 200); // 최소 간격 200ms
    }

    function update() {
        if (keys['ArrowLeft'] && player.x > 0) player.x -= PLAYER_SPEED;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += PLAYER_SPEED;

        apples.forEach((apple, index) => {
            apple.y += apple.speed;

            // 충돌 감지
            if (apple.x < player.x + player.width && apple.x + apple.width > player.x && apple.y < player.y + player.height && apple.y + apple.height > player.y) {
                apples.splice(index, 1);
                score++;

                // 점수 갱신 후, 사과 생성 간격 재설정
                clearInterval(appleIntervalId);
                const newInterval = getSpawnInterval(score);
                appleIntervalId = setInterval(spawnApple, newInterval);
            }

            // 바닥 충돌 감지
            if (apple.y + apple.height >= canvas.height - GROUND_HEIGHT) {
                endGame();
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#5c94fc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6a4d3a';
        ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
        apples.forEach(apple => ctx.drawImage(appleImg, apple.x, apple.y, apple.width, apple.height));
        ctx.fillStyle = 'white';
        ctx.font = "24px 'Press Start 2P'";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`SCORE: ${score}`, 10, 10);
    }

    function gameLoop() {
        if (isGameOver) return;
        update();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function spawnApple() {
        let speed = 2 + Math.floor(score / 10) * 1.5;
        apples.push({ x: Math.random() * (canvas.width - APPLE_WIDTH), y: -APPLE_HEIGHT, width: APPLE_WIDTH, height: APPLE_HEIGHT, speed: speed });
    }

    function startGame() {
        init();
        overlay.style.display = 'none';
        const initialInterval = getSpawnInterval(0);
        appleIntervalId = setInterval(spawnApple, initialInterval);
        gameLoop();
    }
    
    function endGame() {
        if (isGameOver) return;
        isGameOver = true;
        clearInterval(appleIntervalId);
        cancelAnimationFrame(gameLoopId);
        gameOverScreen.style.display = 'block';
        titleText.style.display = 'none';
        overlay.style.display = 'flex';
    }

    // --- 이벤트 리스너 ---
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);
    startButton.addEventListener('click', startGame);

    // --- 초기 설정 ---
    startButton.disabled = true;
    startButton.textContent = '로딩중...';
});