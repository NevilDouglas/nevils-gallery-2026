/**
 * About-pagina van de applicatie.
 *
 * Doel:
 * - extra context geven over de applicatie
 * - toelichten wat bezoekers en admins met het systeem kunnen doen
 */

function About() {
  return (
    <section className="section-spacing">
      <div className="container narrow-container">
        <div className="museum-panel about-panel">
          <p className="eyebrow">About</p>
          <h1>About Nevil&apos;s Gallery</h1>

          <p className="section-text">
            Nevil&apos;s Gallery is a museum-inspired web application for presenting and
            managing a curated digital painting collection.
          </p>

          <p className="section-text">
            Visitors can explore the gallery, browse artworks by artist, and sort the
            collection in a clear and elegant interface.
          </p>

          <p className="section-text">
            Authenticated administrators can manage paintings and users through the
            dashboard, including creating, editing and removing records.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;