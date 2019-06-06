const Colyseus = require("colyseus.js");
const Bot = require("../bot")
const Config = require("../config.json")

class Client {
    constructor(){
      this.roomName = "drink_or_piss";
    }

    connect() {
        this._client = new Colyseus.Client(Config.serverUrl);
        this._client.onOpen.add(()=>this.connected());
    }

    connected(){
        console.log("Connected to server");
        
        this.room = this._client.join(this.roomName);
        this.room.onJoin.add(()=>this.roomJoined());
        this.room.onError.add((error)=>this.onError(error))
        this.room.onStateChange.add((state)=>this.stateChanged(state));
    }

    stateChanged(state) {
        this.state = state;
        Bot.loop();
    }

    roomJoined(error) {
        console.log(`Connected to room ${this.roomName}`);
    }

    onError(){
        console.log("An error occured:");
        console.log(error);
    }
}

const client = new Client();
client.connect();
module.exports = client;