/**
 * Gallerypagina.
 *
 * Functionaliteit:
 * - haalt paintings op uit de backend
 * - filtert op artist
 * - sorteert op titel, artist of ranking
 * - ondersteunt instelbaar aantal items per pagina
 * - toont paginatie
 */

import { useEffect, useMemo, useState } from "react";
import { getPaintings } from "../services/api";
import PaintingCard from "../components/PaintingCard";
import Pagination from "../components/Pagination";

function Gallery() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Sorteer- en filterinstellingen.
   */
  const [sortBy, setSortBy] = useState("title-asc");
  const [artistFilter, setArtistFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Haalt de volledige collectie op.
   */
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPaintings();
        setPaintings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  /**
   * Bepaalt unieke artists voor de filterdropdown.
   */
  const artistOptions = useMemo(() => {
    const uniqueArtists = [...new Set(paintings.map((item) => item.artist).filter(Boolean))];
    return uniqueArtists.sort((a, b) => a.localeCompare(b));
  }, [paintings]);

  /**
   * Filtert en sorteert de paintings op basis van de huidige instellingen.
   */
  const filteredAndSortedPaintings = useMemo(() => {
    let result = [...paintings];

    if (artistFilter !== "all") {
      result = result.filter((item) => item.artist === artistFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "artist-asc":
          return (a.artist || "").localeCompare(b.artist || "");
        case "artist-desc":
          return (b.artist || "").localeCompare(a.artist || "");
        case "ranking-asc":
          return String(a.ranking || "").localeCompare(String(b.ranking || ""));
        case "ranking-desc":
          return String(b.ranking || "").localeCompare(String(a.ranking || ""));
        case "title-asc":
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });

    return result;
  }, [paintings, artistFilter, sortBy]);

  /**
   * Berekent het totale aantal pagina's.
   */
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPaintings.length / itemsPerPage));

  /**
   * Zodra sort/filter/itemsPerPage verandert, springt de lijst terug naar pagina 1.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, artistFilter, itemsPerPage]);

  /**
   * Bepaalt welke paintings op de huidige pagina zichtbaar zijn.
   */
  const paginatedPaintings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPaintings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPaintings, currentPage, itemsPerPage]);

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Collection</p>
          <h1>Gallery overview</h1>
          <p className="section-text">
            Browse the collection with sorting, filtering and pagination.
          </p>
        </div>

        <div className="toolbar museum-panel">
          <div className="toolbar-group">
            <label htmlFor="sortBy">Sort</label>
            <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="artist-asc">Artist A-Z</option>
              <option value="artist-desc">Artist Z-A</option>
              <option value="ranking-asc">Ranking ascending</option>
              <option value="ranking-desc">Ranking descending</option>
            </select>
          </div>

          <div className="toolbar-group">
            <label htmlFor="artistFilter">Artist</label>
            <select
              id="artistFilter"
              value={artistFilter}
              onChange={(event) => setArtistFilter(event.target.value)}
            >
              <option value="all">All artists</option>
              {artistOptions.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-group">
            <label htmlFor="itemsPerPage">Items per page</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(event) => setItemsPerPage(Number(event.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>

        {loading && <p className="status-message">Loading gallery...</p>}
        {error && <p className="status-message error-message">{error}</p>}

        {!loading && !error && paginatedPaintings.length === 0 && (
          <p className="status-message">No paintings found.</p>
        )}

        {!loading && !error && paginatedPaintings.length > 0 && (
          <>
            <div className="gallery-grid">
              {paginatedPaintings.map((painting) => (
                <PaintingCard key={painting.id} painting={painting} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default Gallery;