import React, { useState, useEffect } from "react";
import { GameViewer } from "./GameViewer";

const drinkerState = {
    standing: "standing",
    drinking: "drinking",
    pissing: "pissing",
    puking: "puking"
};

const defaultState = [
    {
        name: "Alex",
        drunkness: 0,
        points: 0,
        action: drinkerState.standing
    },
    {
        name: "Mac",
        drunkness: 0,
        points: 0,
        action: drinkerState.drinking
    },
    {
        name: "Sam",
        drunkness: 0,
        points: 0,
        action: drinkerState.pissing
    },
    {
        name: "Joseph",
        drunkness: 0,
        points: 0,
        action: drinkerState.puking
    }
];

export function GamePage() {
    const [gameState, setGameState] = useState(defaultState);

    useEffect(() => {
        const updateInterval = setInterval(function() {
            const newState = UpdateState(gameState);
            setGameState(newState);
        }, 500);

        return () => {
            clearInterval(updateInterval);
        };
    }, []);

    return (
        <div>
            <h2>Drink or Piss Game</h2>
            <GameViewer gameState={gameState} />
        </div>
    );
}

function UpdateState(gameState) {
    const newState = gameState.map(x => {
        return {
            ...x,
            drunkness: Math.floor(Math.random() * 100),
            points: Math.floor(Math.random() * 100)
        };
    });
    return newState;
}
