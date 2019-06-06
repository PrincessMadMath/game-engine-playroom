import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

const drinkerState = {
    standing: "standing",
    drinking: "drinking",
    pissing: "pissing",
    puking: "puking"
};

interface ClientAction {
  action: "D" | "P";
}

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

    @type("number")
    time = 0;

    createDrinker(id: string) {
        this.drinkers[id] = new Drinker();
    }

    removeDrinker(id: string) {
        delete this.drinkers[id];
    }

    drink(id: string) {
        this.drinkers[id].drunkness += 1;

        if (this.isPuking(this.drinkers[id].drunkness)){
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

    isPuking(drunkness: number) {
        return Math.random() < (drunkness * riskFactor);
    }
}

export class DrinkingGameRoom extends Room<DrinkingGameState> {
    private queuedActions: { [sessionId: string]: "P" | "D" } = {};
    private time: number = 0;

    onInit(options: any) {
        console.log("DrinkingGameRoom created!", options);

        this.queuedActions = {};
        this.time = 0;
        this.autoDispose = false;

        this.setPatchRate(1000);
        this.setState(new DrinkingGameState());
        this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000);
    }

    onJoin(client: Client, options: any) {
        this.state.createDrinker(client.sessionId);
    }

    onLeave(client: Client, options: any) {
        this.state.removeDrinker(client.sessionId);
    }

    onMessage(client: Client, message: ClientAction) {
        console.log(`DrinkingGameRoom received message from + ${client.sessionId} : ${message}`);

        if (message && message.action) {
           this.queuedActions[client.sessionId] = message.action;
        }
    }

    update(deltaTime: number) {
      for (const sessionId in this.queuedActions) {
        const action = this.queuedActions[sessionId];

        if (action === "D") {
          this.state.drink(sessionId);
        } else if (action === "P") {
          this.state.piss(sessionId);
        }
      }

      console.log(JSON.stringify(this.state));

      this.state.time++;
      this.queuedActions = {};
    }

    onDispose() {
        console.log("Dispose DrinkingGameRoom!");
    }
}
