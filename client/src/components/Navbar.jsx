/**
 * Navigatiebalk van de applicatie.
 *
 * Gewenst gedrag:
 * - als niemand is ingelogd: User Login zichtbaar
 * - als iemand is ingelogd: User Login volledig verbergen
 * - als admin is ingelogd: Dashboard zichtbaar
 * - uitloggen zet gebruiker terug naar home
 */

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link to="/" className="brand">
          <span className="brand-mark">NG</span>
          <span className="brand-text">Nevil's Gallery</span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>

          {isAuthenticated && isAdmin && <NavLink to="/dashboard">Dashboard</NavLink>}

          <NavLink to="/about">About</NavLink>  

          {!isAuthenticated && <NavLink to="/login">Login</NavLink>}

          {isAuthenticated && (
            <button className="nav-button" onClick={handleLogout} type="button">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;