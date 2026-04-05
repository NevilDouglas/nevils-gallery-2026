/**
 * Homepagina van de applicatie.
 *
 * Doel:
 * - eerste indruk geven van de museumachtige stijl
 * - bezoeker snel doorsturen naar gallery of login
 */

import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Curated digital collection</p>

          <h1>A museum-inspired gallery for managing and presenting artworks.</h1>

          <p className="hero-text">
            Explore the collection, browse artworks by artist, sort by ranking,
            and manage the archive through a secure admin dashboard.
          </p>

          <div className="hero-actions">
            <Link to="/gallery" className="primary-button">
              Explore Gallery
            </Link>

            <Link to="/login" className="secondary-button">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-card">
            <span className="panel-kicker">Featured experience</span>

            <h2>Minimal, elegant, responsive.</h2>

            <p>
              Designed to feel like a contemporary museum website: spacious,
              refined, image-led, and comfortable on both laptop and mobile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;