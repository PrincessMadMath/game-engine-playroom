import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

const drinkerState = {
    standing: "standing",
    drinking: "drinking",
    pissing: "pissing",
    puking: "puking"
};

export class Drinker extends Schema {
    @type("number")
    drinkCount = 0;
    @type("number")
    drunkness = 0;
    @type("number")
    points = 0;
    @type("string")
    action = drinkerState.standing;
}

export class DrinkingGameState extends Schema {
    @type({ map: Drinker })
    drinkers = new MapSchema<Drinker>();

    createDrinker(id: string) {
        this.drinkers[id] = new Drinker();
    }

    removeDrinker(id: string) {
        delete this.drinkers[id];
    }

    drink(id: string) {
        this.drinkers[id].drunkness += 1;
        this.drinkers[id].points += 1;
        this.drinkers[id].action += drinkerState.drinking;
    }

    piss(id: string) {
        this.drinkers[id].drunkness = 0;
        this.drinkers[id].points -= 100;
        this.drinkers[id].action += drinkerState.pissing;
    }
}

export class DrinkingGameRoom extends Room<DrinkingGameState> {
    onInit(options: any) {
        console.log("DrinkingGameRoom created!", options);

        this.setState(new DrinkingGameState());
    }

    onJoin(client: Client, options: any) {
        this.state.createDrinker(client.sessionId);
    }

    onLeave(client: Client, options: any) {
        this.state.removeDrinker(client.sessionId);
    }

    onMessage(client: Client, message: any) {
        console.log(
            "DrinkingGameRoom received message from",
            client.sessionId,
            ":",
            message
        );

        if (message.action == "D") {
            this.state.drink(client.sessionId);
        } else {
            this.state.piss(client.sessionId);
        }
    }
    onDispose() {
        console.log("Dispose DrinkingGameRoom!");
    }
}
