const Colyseus = require("colyseus.js");

var client = new Colyseus.Client("ws://localhost:4321");

client.onOpen.add(() => {
    var myId = client.id;

    let room = client.join("drink_or_piss");

    room.onStateChange.add(function(state) {
        console.log("the room state has been updated:", state);
        for (var drinker in state.drinkers) {
            var drinkCount = state.drinkers[drinker]._points;
        }

        room.send({ action: "D" });
    });
});
