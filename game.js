let game = {
    ctx: null,
    sprites: {
        background: null,
        ball: null,
        platform: null
    },
    init: function() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
    },
    preload(callback) {
        let loaded = 0,
            required = Object.keys(this.sprites).length;

        for(let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/sprites/${key}.png`;
            this.sprites[key].addEventListener('load', () => {
                loaded += 1;

                if (loaded >= required) {
                    callback();
                }
            });
        }
    },
    render() {
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, 0, 0);
        this.ctx.drawImage(this.sprites.platform, 0, 0);
    },
    run() {
        window.requestAnimationFrame(() => {
            this.render();
        });
    },
    start: function() {
        this.init();
        this.preload(() => this.run());
    }
};

window.addEventListener("DOMContentLoaded", () => {
    game.start();
});