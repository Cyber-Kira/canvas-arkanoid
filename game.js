const KEYS = {
    LEFT: 'a',
    RIGHT: 'd',
    SPACE: ' '
};

let game = {
    ctx: null,
    running: true,
    platform: null,
    ball: null,
    blocks: [],
    score: 0,
    rows: 4,
    cols: 8,
    width: 1280,
    height: 720,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null
    },
    sounds: {
        bump: null
    },
    init: function () {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.setEvents();
    },
    setEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.key === KEYS.SPACE) {
                this.platform.fire();
            } else if (e.key === KEYS.LEFT || e.key === KEYS.RIGHT) {
                this.platform.start(e.key);
            }
            window.addEventListener('keyup', () => {
                this.platform.stop();
            });
        });
    },
    preload(callback) {
        let loaded = 0,
            required = Object.keys(this.sprites).length;
            required += Object.keys(this.sounds).length;

        const onAssetsLoad = () => {
            loaded += 1;

            if (loaded >= required) {
                callback();
            }
        };

        this.preloadSprites(onAssetsLoad);
        this.preloadAudio(onAssetsLoad);
    },
    preloadSprites(onAssetsLoad) {
        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/sprites/${key}.png`;
            this.sprites[key].addEventListener('load', onAssetsLoad);
        }
    },
    preloadAudio(onAssetsLoad) {
        for (let key in this.sounds) {
            this.sounds[key] = new Audio(`sounds/${key}.mp3`);
            this.sounds[key].addEventListener('canplaythrough', onAssetsLoad, { once: true });
        }
    },
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
    },
    create() {
        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                this.blocks.push({
                    active: true,
                    width: 111,
                    height: 39,
                    x: 116 * col + 170,
                    y: 50 * row + 60
                });
            }
        }
    },
    renderBlocks() {
        for (let block of this.blocks) {
            if (block.active) {
                this.ctx.drawImage(this.sprites.block, block.x, block.y);
            }
        }
    },
    update() {
        this.platform.collideWorldBounds();
        this.platform.move();
        this.ball.move();
        this.ball.collideWorldBounds();
        this.collideBlocks();
        this.collidePlatform();
    },
    addScore() {
        this.score += 1;

        if (this.score >= this.blocks.length) {
            this.end('YOU WON!')
        }
    },
    collideBlocks() {
        for (let block of this.blocks) {
            if (this.ball.collide(block) && block.active) {
                this.ball.bumpBlock(block);
                this.addScore();
                this.sounds.bump.play();
            };
        };
    },
    collidePlatform() {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
        }
    },
    run() {
        if (this.running) {
            window.requestAnimationFrame(() => {
                this.update();
                this.render();
                this.run();
            });
        }
    },
    start: function () {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
    },
    end(message) {
        this.running = false;
        location.reload();
        alert(message);
    },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

game.ball = {
    velocity: 5,
    dx: 0,
    dy: 0,
    x: 605,
    y: 560,
    width: 40,
    height: 40,
    start() {
        this.dy = -this.velocity;
        this.dx = game.random(-this.velocity, this.velocity);
    },
    move() {
        if (this.dy) {
            this.y += this.dy;
        }
        if (this.dx) {
            this.x += this.dx;
        }
    },
    collide(element) {
        let x = this.x + this.dx,
            y = this.y + this.dy;

        if (x + this.width > element.x &&
            x < element.x + element.width &&
            y + this.height > element.y &&
            y < element.y + element.height) {
            return true;
        }
        return false;
    },
    bumpBlock(block) {
        if (block) {
            block.active = false;
            this.dy *= -1;

        }
    },
    bumpPlatform(platform) {
        if (platform) {
            if (platform.dx) {
                this.x += platform.dx;
            }
            let touchX = this.x + (this.width / 2);

            if (this.dy > 0) {
                this.dy = -this.velocity;
                this.dx = this.velocity * platform.getTouchOffset(touchX);
            }
        }
    },
    collideWorldBounds() {
        const x = this.x + this.dx,
            y = this.y + this.dy;

        const ballLeft = x,
            ballTop = y,
            ballRight = ballLeft + this.width,
            ballBottom = ballTop + this.height;

        const worldleft = 0,
            worldTop = 0,
            worldRight = game.width,
            worldBottom = game.height;

        if (ballLeft < worldleft) {
            this.x = 0;
            this.dx = this.velocity;
            game.sounds.bump.play();
        } else if (ballRight > worldRight) {
            this.x = worldRight - this.width;
            this.dx = -this.velocity;
            game.sounds.bump.play();
        } else if (ballTop < worldTop) {
            this.y = 0;
            this.dy = this.velocity;
            game.sounds.bump.play();
        } else if (ballBottom > worldBottom) {
            game.end('Game over!');
        }
    }
};

game.platform = {
    velocity: 6,
    dx: 0,
    x: 500,
    y: 600,
    ball: game.ball,
    width: 251,
    height: 41,
    fire() {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
        }
    },
    start(direction) {
        if (direction === KEYS.LEFT) {
            this.dx = -this.velocity;
        } else if (direction === KEYS.RIGHT) {
            this.dx = this.velocity;
        }
    },
    stop() {
        this.dx = 0;
    },
    move() {
        if (this.dx) {
            this.x += this.dx;
            if (this.ball) {
                this.ball.x += this.dx;
            }
        }

    },
    getTouchOffset(x) {
        const diff = (this.x + this.width) - x,
            offset = this.width - diff,
            result = 2 * offset / this.width;
        return result - 1;
    },
    collideWorldBounds() {
        const x = this.x + this.dx,
            platformLeft = x,
            platformRight = platformLeft + this.width,
            worldleft = 0,
            worldRight = game.width;

        if (platformLeft < worldleft || platformRight > worldRight) {
            this.dx = 0;
        }
    }
};

window.addEventListener("DOMContentLoaded", () => {
    game.start();
});