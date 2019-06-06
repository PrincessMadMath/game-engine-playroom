const Game = require("./game");

class Player {
    drink() {
        Game.room.send({ action: "D" });
    }

    piss() {
        Game.room.send({ action: "P" });
    }
}

module.exports = new Player();