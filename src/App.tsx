import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import GrassScanner from "./components/GrassScanner";
import GrassSecure from "./pages/GrassSecure";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      {/* Layout container for header + content */}
      <div className="min-h-screen flex flex-col">
        {/* Header (always on top) */}
        <Layout />

        {/* Page content below */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/grass-scanner"
              element={
                <div className="flex items-center justify-center bg-green-50 px-4 min-h-screen">
                  <GrassScanner />
                </div>
              }
            />

            <Route path="/grass-secure" element={<GrassSecure />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
