const Colyseus = require("colyseus.js");
const Bot = require("../bot")
const Config = require("../config.json")

class Game {
    constructor(){
      this.roomName = "drink_or_piss";
    }

    init() {
        this.client = new Colyseus.Client(Config.serverUrl);
        this.client.onOpen.add(()=>this.connected());
    }

    connected(){
        console.log("Connected to server");
        
        this.room = this.client.join(this.roomName);
        this.room.onJoin.add(()=>this.roomJoined());
        this.room.onError.add((error)=>this.onError(error))
        this.room.onStateChange.add((state)=>this.stateChanged(state));
    }

    stateChanged(gameState) {
        console.log(JSON.stringify(gameState));
        if (gameState && gameState.drinkers) {
            const playerId = this.room.sessionId;
            const playerState = gameState.drinkers[playerId];

            if (playerState) {
                playerState.time = gameState.time;

                this.state = playerState;
                Bot.loop();
            }
        }
    }

    roomJoined(error) {
        console.log(`Connected to room ${this.roomName}`);
    }

    onError(){
        console.log("An error occured:");
        console.log(error);
    }
}

const game = new Game();
game.init();
module.exports = game;