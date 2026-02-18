// =============================================
// PLATFORM GAME - IMPROVED VERSION
// Changes:
//   1. Parallax background (hills move slower than foreground)
//   2. Camera starts scrolling when player hits screen midpoint
//   3. Random platform generation as world expands
// =============================================

const gravity = 0.5;
const speed = 5;
const baseHeight = 160;

// Parallax scroll offsets (separate for each layer)
let bgOffset = 0;      // background (slowest)
let hillsOffset = 0;   // hills (medium)
let worldOffset = 0;   // platforms / world (fastest = 1:1)

// Parallax multipliers relative to world scroll
const BG_PARALLAX = 0.2;
const HILLS_PARALLAX = 0.5;

// Camera trigger: background starts scrolling when player crosses this X
const SCROLL_TRIGGER_X = window.innerWidth / 2;

const maxRight = SCROLL_TRIGGER_X;   // player won't go past screen midpoint
const maxLeft  = 180;

// Platform generation tracking
let lastPlatformX = 0;       // world-space X of the last generated platform
const PLATFORM_SPACING_MIN = 200;
const PLATFORM_SPACING_MAX = 420;
const PLATFORM_Y_VARIANCE  = 180; // how much Y can vary up/down from base

const gameCanvas = document.querySelector("#gameCanvas");
gameCanvas.width  = window.innerWidth;
gameCanvas.height = window.innerHeight;
gameCanvas.style.background = "black";

const keys = { right: false, left: false };
const context = gameCanvas.getContext("2d");

// ------------------------------------------------
// Player
// ------------------------------------------------
class Player {
    constructor() {
        this.position  = { x: 150, y: 300 };
        this.velocity  = { x: 0, y: 1 };
        this.image     = playerStandRight;
        this.width     = 66;
        this.height    = 150;
        this.frames    = 0;
        this.cropwidth = 177;
    }

    draw() {
        this.frames++;

        if (this.image === playerStandRight && this.frames > 59) this.frames = 0;
        if (this.image === playerRunRight   && this.frames > 29) this.frames = 0;

        context.drawImage(
            this.image,
            this.cropwidth * this.frames, 0,
            this.cropwidth, 400,
            this.position.x, this.position.y,
            this.width, this.height
        );
    }

    update() {
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // Fell off the world → reload
        if (this.position.y + this.height + this.velocity.y >= window.innerHeight) {
            this.velocity.y = 0;
            window.location.reload();
        } else {
            this.velocity.y += gravity;
        }

        this.draw();
    }
}

// ------------------------------------------------
// Platform
// ------------------------------------------------
class Platform {
    constructor(x, y, image) {
        this.position = { x, y };
        this.image    = image;
        this.width    = image.width;
        this.height   = image.height;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);
    }
}

// ------------------------------------------------
// Image loading
// ------------------------------------------------
let gameStart = false;
let count     = 0;

let backImage      = new Image();
let hillsImage     = new Image();
let platformBase   = new Image();
let platformSmall  = new Image();
let playerStandRight = new Image();
let playerRunRight   = new Image();

const images = [backImage, hillsImage, platformBase, platformSmall, playerStandRight, playerRunRight];

images.forEach((image) => {
    image.addEventListener("load", () => {
        count++;
        if (count === images.length) createObjects();
    });
});

backImage.src        = "./images/background.png";
hillsImage.src       = "./images/hills.png";
platformBase.src     = "./images/platform.png";
platformSmall.src    = "./images/platformSmallTall.png";
playerStandRight.src = "./images/spriteStandRight.png";
playerRunRight.src   = "./images/spriteRunRight.png";

// ------------------------------------------------
// World / Platform generation
// ------------------------------------------------
let player;
const platforms = [];

function createObjects() {
    player = new Player();

    // ---- Base ground segments ----
    const basePlatform  = new Platform(0,                            window.innerHeight - platformBase.height, platformBase);
    const basePlatform1 = new Platform(650,                          window.innerHeight - platformBase.height, platformBase);
    const basePlatform2 = new Platform(650 + platformBase.width,     window.innerHeight - platformBase.height, platformBase);

    // ---- First elevated platform ----
    const platform1 = new Platform(
        280,
        window.innerHeight - platformBase.height - platformSmall.height + 100,
        platformSmall
    );

    platforms.push(platform1, basePlatform, basePlatform1, basePlatform2);

    // Track where procedural generation should start (world-space)
    lastPlatformX = 650 + platformBase.width * 2;

    animate();
}

/**
 * Generate new platforms ahead of the player when needed.
 * worldX = the right edge of visible screen in world-space
 */
function generatePlatformsAhead(worldRightEdge) {
    // Keep generating until platforms extend well past the right edge
    while (lastPlatformX < worldRightEdge + window.innerWidth) {
        const spacing = PLATFORM_SPACING_MIN + Math.random() * (PLATFORM_SPACING_MAX - PLATFORM_SPACING_MIN);
        lastPlatformX += spacing;

        // Randomise Y — keep platforms within a reasonable vertical band
        const baseY   = window.innerHeight - platformBase.height - platformSmall.height + 100;
        const minY    = baseY - PLATFORM_Y_VARIANCE;
        const maxY    = baseY + PLATFORM_Y_VARIANCE * 0.5;
        const platY   = minY + Math.random() * (maxY - minY);

        // Convert world-space X to screen-space X
        const screenX = lastPlatformX - worldOffset;

        // Pick randomly between small platform and base segment
        const useBase = Math.random() < 0.35;
        const img     = useBase ? platformBase : platformSmall;
        const y       = useBase ? window.innerHeight - platformBase.height : platY;

        platforms.push(new Platform(screenX, y, img));
    }

    // Remove platforms that have scrolled far off to the left (memory cleanup)
    const CLEANUP_THRESHOLD = -600;
    for (let i = platforms.length - 1; i >= 0; i--) {
        if (platforms[i].position.x + platforms[i].width < CLEANUP_THRESHOLD) {
            platforms.splice(i, 1);
        }
    }
}

// ------------------------------------------------
// Main loop
// ------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // ---------- Parallax drawing ----------
    // Background tiles (very slow)
    const bgW = backImage.width || window.innerWidth;
    const bgTiles = Math.ceil(window.innerWidth / bgW) + 2;
    for (let i = 0; i < bgTiles; i++) {
        context.drawImage(backImage, i * bgW - (bgOffset % bgW), 0);
    }

    // Hills (medium speed)
    const hillsW = hillsImage.width || window.innerWidth;
    const hillTiles = Math.ceil(window.innerWidth / hillsW) + 2;
    for (let i = 0; i < hillTiles; i++) {
        context.drawImage(hillsImage, i * hillsW - (hillsOffset % hillsW), 0);
    }

    // ---------- Platforms ----------
    platforms.forEach(p => p.draw());

    // ---------- Player ----------
    player.update();

    // ---------- Win condition ----------
    if (worldOffset >= 5000) {
        context.fillStyle = "rgba(0,0,0,0.5)";
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = "white";
        context.font = "bold 64px sans-serif";
        context.textAlign = "center";
        context.fillText("YOU WIN!", window.innerWidth / 2, window.innerHeight / 2);
    }

    // ---------- Collisions ----------
    platforms.forEach(platform => {
        // Side collision (stop horizontal movement into wall)
        if (
            player.position.x + player.width + 1 >= platform.position.x &&
            player.position.x                     <= platform.position.x + platform.width &&
            player.position.y + player.height      >= platform.position.y &&
            player.position.y                     <= platform.position.y + platform.height
        ) {
            player.velocity.x = 0;
        }

        // Top collision (land on platform)
        if (
            (player.position.y + player.height)                    <= platform.position.y &&
            (player.position.y + player.height + player.velocity.y) >= platform.position.y &&
            player.position.x + player.width                        >= platform.position.x &&
            player.position.x                                       <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
        }
    });

    // ---------- Sprite swap ----------
    if (keys.right) {
        player.image     = playerRunRight;
        player.width     = 127;
        player.cropwidth = 340;
    } else {
        player.image     = playerStandRight;
        player.width     = 66;
        player.cropwidth = 177;
    }

    // ---------- Movement & camera ----------
    if (keys.right) {
        if (player.position.x < maxRight) {
            // Player hasn't reached midpoint yet — move player, world stays
            player.velocity.x = speed;
        } else {
            // Player AT midpoint — scroll world (and parallax layers)
            player.velocity.x = 0;

            worldOffset  += speed;
            bgOffset     += speed * BG_PARALLAX;
            hillsOffset  += speed * HILLS_PARALLAX;

            platforms.forEach(p => { p.position.x -= speed; });
        }
    } else if (keys.left) {
        if (player.position.x > maxLeft) {
            player.velocity.x = -speed;
        } else {
            player.velocity.x = 0;

            if (worldOffset > 0) {
                worldOffset  -= speed;
                bgOffset     -= speed * BG_PARALLAX;
                hillsOffset  -= speed * HILLS_PARALLAX;

                platforms.forEach(p => { p.position.x += speed; });
            }
        }
    } else {
        player.velocity.x = 0;
    }

    // ---------- Procedural platform generation ----------
    // worldRightEdge = world-space coordinate of right side of screen
    const worldRightEdge = worldOffset + window.innerWidth;
    generatePlatformsAhead(worldRightEdge);
}

// ------------------------------------------------
// Input
// ------------------------------------------------
addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowLeft")  keys.left  = true;
    if (e.key === "ArrowUp")    player.velocity.y = -11;
});

addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowLeft")  keys.left  = false;
});