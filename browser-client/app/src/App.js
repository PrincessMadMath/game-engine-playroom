import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { GamePage } from "./DrinkOrPiss/GamePage";

function App() {
    return (
        <div className="App">
            <h1>Admin Page</h1>
            <GamePage />
        </div>
    );
}

export default App;
