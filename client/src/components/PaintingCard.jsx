/**
 * Kaartcomponent voor één schilderij.
 *
 * Werkt nu correct met:
 * - bestaande databasepaden zoals /assets/img/initials/...
 * - nieuwe uploadpaden zoals /assets/uploads/...
 * - externe URLs als die nog in oude data voorkomen
 */

import { buildAssetUrl } from "../services/api";

function PaintingCard({ painting }) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80";

  const imageSrc = buildAssetUrl(painting.image?.trim()) || fallbackImage;

  return (
    <article className="painting-card">
      <div className="painting-image-wrap">
        <img
          src={imageSrc}
          alt={painting.altText || painting.title || "Painting image"}
          className="painting-image"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <div className="painting-content">
        <p className="painting-label">Collection item</p>
        <h3>{painting.title || "Untitled work"}</h3>
        <p className="painting-meta">{painting.artist || "Unknown artist"}</p>
        <p className="painting-ranking">Ranking: {painting.ranking || "-"}</p>
        <p className="painting-description">
          {painting.description || "No description available for this item."}
        </p>
      </div>
    </article>
  );
}

export default PaintingCard;