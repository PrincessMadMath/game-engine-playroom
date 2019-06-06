import Phaser from "phaser";
import React, { useEffect } from "react";

export function GameViewer({ gameState }) {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: "phaser-game",
            width: 800,
            height: 600,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        new Phaser.Game(config);
    }, []);

    return (
        <div>
            <div id="phaser-game" />
        </div>
    );
}

function preload() {}

function update() {}

function create() {
    var drinkCountText = this.add.text(0, this.scale.height - 200, "Drink", {
        font: "32px Arial",
        fill: "#ff0044",
        align: "center"
    });
}
