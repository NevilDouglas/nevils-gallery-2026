/**
 * Entry point van de React-applicatie.
 *
 * Verantwoordelijkheden:
 * - React renderen in de root van index.html
 * - BrowserRouter beschikbaar maken voor routing
 * - AuthProvider beschikbaar maken voor de hele app
 * - globale styling laden
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);