/**
 * AuthContext beheert de authenticatiestatus van de gebruiker.
 *
 * Doelen:
 * - token opslaan en uitlezen uit localStorage
 * - JWT-payload uitlezen zodat adminstatus bekend wordt
 * - login/logout-functies centraal aanbieden
 * - in de hele app eenvoudig kunnen bepalen:
 *   - of iemand is ingelogd
 *   - of iemand admin is
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../services/api";

const AuthContext = createContext(null);

/**
 * Decodeert de payload van een JWT-token.
 *
 * Let op:
 * - dit is alleen bedoeld om client-side info uit het token te lezen
 * - échte beveiliging blijft altijd op de backend plaatsvinden
 */
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  /**
   * Bij het opstarten proberen we eerst een eventueel bestaand token uit localStorage te laden.
   */
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  /**
   * Houdt localStorage en user-state synchroon met het token.
   */
  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("token");
      return;
    }

    localStorage.setItem("token", token);

    const decodedUser = parseJwt(token);
    setUser(decodedUser || null);
  }, [token]);

  /**
   * Logt in via de backend en bewaart daarna het token.
   */
  const login = async (username, password) => {
    const data = await loginRequest({ username, password });
    setToken(data.token);
    return data;
  };

  /**
   * Logt lokaal uit door token en user-state te wissen.
   */
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  /**
   * De contextwaarde wordt gememoized om onnodige rerenders te beperken.
   */
  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.admin === "true",
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook om AuthContext makkelijk te gebruiken in componenten.
 */
export function useAuth() {
  return useContext(AuthContext);
}