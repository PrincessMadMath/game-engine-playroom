import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

const drinkerState = {
    standing: "standing",
    drinking: "drinking",
    pissing: "pissing",
    puking: "puking"
};

const riskFactor = 0.05;
const pointsPerDrink = 10;
const pointsLostPerPiss = 10;
const drunknessLostPerPiss = 3;

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

        if (this.IsPuking(this.drinkers[id].drunkness)){
            this.drinkers[id].drinkerState = drinkerState.puking
            this.drinkers[id].points -= 100;
            this.drinkers[id].drunkness = 0;
            return;
        }

        this.drinkers[id].points += pointsPerDrink * this.drunknessBonusFactor(this.drinkers[id].drunkness);
        this.drinkers[id].action += drinkerState.drinking;
    }

    piss(id: string) {
        this.drinkers[id].drunkness -= this.drinkers[id].drunkness >= drunknessLostPerPiss ?
        drunknessLostPerPiss : this.drinkers[id].drunkness;
        this.drinkers[id].points -= pointsLostPerPiss;
        this.drinkers[id].action += drinkerState.pissing;
    }

    drunknessBonusFactor(drunkness: number) {
        return (1 + drunkness / 10);
    }

    IsPuking(drunkness: number) {
        return Math.random() < (drunkness * riskFactor);
    }
}

export class DrinkingGameRoom extends Room<DrinkingGameState> {
    onInit(options: any) {
        console.log("DrinkingGameRoom created!", options);

        this.setPatchRate(1000);
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
