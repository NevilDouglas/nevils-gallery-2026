/**
 * ProtectedRoute voorkomt dat onbevoegde gebruikers bepaalde pagina's openen.
 *
 * Gebruik:
 * - zonder adminOnly: alleen ingelogde gebruiker nodig
 * - met adminOnly: gebruiker moet bovendien admin zijn
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  /**
   * Niet ingelogd:
   * stuur gebruiker door naar de loginpagina.
   */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Wel ingelogd, maar geen admin terwijl dat wel vereist is:
   * stuur dan terug naar home.
   */
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;