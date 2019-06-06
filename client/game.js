const Colyseus = require("colyseus.js");
const Config = require("./config.json")

class Game {
    constructor(){
      this._roomName = "drink_or_piss";
    }

    _init() {
        this._client = new Colyseus.Client(Config.serverUrl);
        this._client.onOpen.add(()=>this._connected());
    }

    _connected(){
        console.log("Connected to server");
        
        this._room = this._client.join(this._roomName);
        this._room.onJoin.add(()=>this._roomJoined());
        this._room.onError.add((error)=>this._onError(error))
        this._room.onStateChange.add((state)=>this._stateChanged(state));
    }

    _stateChanged(state) {
        this.state = state;
        this.loop();
    }

    _roomJoined(error) {
        console.log(`Connected to room ${this._roomName}`);
    }

    _onError(){
        console.log("An error occured:");
        console.log(error);
    }


    drink() {
        this._room.send({ action: "D" });
    }

    piss() {
        this._room.send({ action: "P" });
    }

}

const game = new Game()
game._init()
module.exports = game