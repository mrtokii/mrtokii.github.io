class hudManager {
    constructor() {

    }

    drawGameHud() {

        let ctx = getCurrentContext();

        // Drawing ammo box
        let playerAmmo = getGameManager().player.ammo;
        let hudAmmoImage = getSpriteManager().getSprite('bullet-hud');
        let hudAmmoPadding = 20;
        let ammoPos = { x: hudAmmoPadding, y: getCurrentCanvas().height - hudAmmoPadding - hudAmmoImage.h };

        for(let i = 0; i < playerAmmo; i++) {
            ctx.drawImage(getSpriteManager().image,
                hudAmmoImage.x,
                hudAmmoImage.y,
                hudAmmoImage.w,
                hudAmmoImage.h,
                ammoPos.x + ( (hudAmmoImage.w + 5) * i),
                ammoPos.y,
                hudAmmoImage.w,
                hudAmmoImage.h
            );
        }

        // Drawing score
        ctx.font = '30px arcade-classic';
        ctx.textBaseline = "top";
        context.textAlign = "left";
        ctx.fillStyle = 'white';
        ctx.fillText(getScoreManager().currentScore(), 20, 20);
    }

    drawText(text, size, x, y, baseline) {
        let ctx = getCurrentContext();
        ctx.font = `${size}px arcade-classic`;
        ctx.textBaseline = baseline;
        context.textAlign = 'center';
        ctx.fillStyle = 'white';

        let lineheight = size;
        let lines = text.split('\n');

        for (var i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], x, y + (i*lineheight) );

        //ctx.fillText(text, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2);
    }

    drawTitleText(text) {
        this.drawText(text, 30, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'bottom');
    }

    drawSubtitleText(text) {
        this.drawText(text, 20, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'top');
    }

    drawPressFireText() {
        this.drawText('Press fire button', 18, getCurrentCanvas().width / 2, getCurrentCanvas().height - 30, 'bottom');
    }

    drawEndLevel(score, levelName) {
        this.drawTitleText(`Score:  ${score}`);
        this.drawSubtitleText(`${levelName}  completed!`);
        this.drawPressFireText();
    }


}