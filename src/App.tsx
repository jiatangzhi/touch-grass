import React from "react";
import GrassScanner from "./components/GrassScanner";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          🌿 Grass Scanner
        </h1>
        <GrassScanner />
      </div>
    </div>
  );
}

export default App;
