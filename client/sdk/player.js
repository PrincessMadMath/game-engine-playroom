const Client = require("./client");

class Player {
    drink() {
        Client.room.send({ action: "D" });
    }

    piss() {
        Client.room.send({ action: "P" });
    }
}

module.exports = new Player();