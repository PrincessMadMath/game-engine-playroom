const Client = require("./client");

class Game {

    get player() {
        return Client.state.drinkers[Client.room.sessionId];
    }
}

module.exports = new Game();