const Colyseus = require("colyseus.js");

class Game {
    constructor(){
      this._roomName = "drink_or_piss";
    }

    connect() {
        this._client = new Colyseus.Client("ws://localhost:4321");

        this._client.onOpen.add(() => {
            this._room = this._client.join(this._roomName);
            this._room.onStateChange.add((state) => {
                this.state = state;
                this.loop();
            });
        });
    }

    drink() {
        this._room.send({ action: "D" });
    }

    piss() {
        this._room.send({ action: "P" });
    }

}

const game = new Game()
game.connect()
module.exports = game