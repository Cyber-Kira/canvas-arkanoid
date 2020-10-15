let game = {
    ctx: null,
    platform: null,
    ball: null,
    blocks: [],
    rows: 4,
    cols: 8,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null
    },
    init: function () {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.setEvents();
    },
    setEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'a') {
                this.platform.dx = -this.platform.velocity;
                this.ball.dx = -this.ball.velocity;
            } else if (e.key === 'd') {
                this.platform.dx = this.platform.velocity;
                this.ball.dx = this.ball.velocity;
            }
        });
        window.addEventListener('keyup', () => {
            this.platform.dx = 0;
            this.ball.dx = 0;
        });
    },
    preload(callback) {
        let loaded = 0,
            required = Object.keys(this.sprites).length;

        const onImageLoad = () => {
            loaded += 1;

            if (loaded >= required) {
                callback();
            }
        };

        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/sprites/${key}.png`;
            this.sprites[key].addEventListener('load', onImageLoad);
        }
    },
    render() {
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
    },
    create() {
        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                this.blocks.push({
                    x: 116 * col + 170,
                    y: 50 * row + 60
                });
            }
        }
    },
    renderBlocks() {
        for (let block of this.blocks) {
            this.ctx.drawImage(this.sprites.block, block.x, block.y);
        }
    },
    update() {
        this.platform.move();
        this.ball.move();
    },
    run() {
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        });
    },
    start: function () {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
    }
};

game.platform = {
    velocity: 6,
    dx: 0,
    x: 500,
    y: 600,
    move() {
        if (this.dx) {
            this.x += this.dx;
        }
    }
};

game.ball = {
    x: 605,
    y: 560,   
    velocity: 6,
    dx: 0,
    move() {
        if (this.dx) {
            this.x += this.dx;
        }
    }
};

window.addEventListener("DOMContentLoaded", () => {
    game.start();
});