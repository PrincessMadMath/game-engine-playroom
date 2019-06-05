import React, { useState } from "react";

export function GameViewer({ gameState }) {
    return <div>{<span>{JSON.stringify(gameState)}</span>}</div>;
}
