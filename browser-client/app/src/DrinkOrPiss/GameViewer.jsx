import Phaser from "phaser";
import React from "react";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};
const game = new Phaser.Game(config);
function preload() {

}

function create() {
    var drinkCountText =  this.add.text(0,this.scale.height - 200, "Drink", {
        font: "32px Arial",
        fill: "#ff0044",
        align: "center"
    });

}   
export function GameViewer({ gameState }) {
    return <div>{<span>{JSON.stringify(gameState)}</span>}</div>;
}
