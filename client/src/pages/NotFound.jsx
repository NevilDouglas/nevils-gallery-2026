/**
 * Fallbackpagina voor onbekende routes.
 */

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="section-spacing">
      <div className="container narrow-container">
        <div className="museum-panel">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="section-text">
            The page you are looking for does not exist.
          </p>

          <Link to="/" className="primary-button">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;