const { Game, Player } = require("./sdk");

module.exports.loop = function () {
    Player.drink();
    if(Game.player){
        console.log(Game.player["points"]);
    }
}