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
        //ctx.fillStyle = 'white';

        let lineheight = size;
        let lines = text.split('\n');

        for (var i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], x, y + (i*lineheight) );

        //ctx.fillText(text, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2);
    }

    drawTitleText(text) {
        getCurrentContext().fillStyle = 'white';
        this.drawText(text, 30, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'bottom');
    }

    drawSubtitleText(text) {
        getCurrentContext().fillStyle = 'white';
        this.drawText(text, 20, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'top');
    }

    drawPressFireText() {
        getCurrentContext().fillStyle = 'white';
        this.drawText('Press  fire  button', 18, getCurrentCanvas().width / 2, getCurrentCanvas().height - 30, 'bottom');
    }

    drawEndLevel() {
        this.drawTitleText(`Great  job!`);
        this.drawSubtitleText(`Enemies  killed:  ${getScoreManager().currentKills()}\nShots  fired:  ${getScoreManager().currentShots()}\n---------------------------\nTotal  score:  ${getScoreManager().currentScore()}`);
        this.drawPressFireText();
    }

    drawLoadingScreen() {
        getGameManager().clearScreen();
        this.drawTitleText(`Loading`);
        this.drawSubtitleText(`Please  wait`);
    }

    drawLevelHint(hint) {
        getCurrentContext().fillStyle = '#004a8f';
        this.drawText(hint, 18, getCurrentCanvas().width / 2, getCurrentCanvas().height - 30, 'bottom');
    }

    drawHero(spritename) {
        let sprite = getSpriteManager().getSprite(spritename);
        getCurrentContext().drawImage(getSpriteManager().image,
            sprite.x,
            sprite.y,
            sprite.w,
            sprite.h,
            getCurrentCanvas().width / 2 - 150,
            getCurrentCanvas().height / 2 - 120,
            300,
            85
        );
    }


}