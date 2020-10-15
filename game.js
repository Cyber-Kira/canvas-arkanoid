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
    run() {
        window.requestAnimationFrame(() => {
            this.render();
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
    x: 500,
    y: 600
};

game.ball = {
    x: 605,
    y: 560
};

window.addEventListener("DOMContentLoaded", () => {
    game.start();
});