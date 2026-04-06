/**
 * Helperfunctie om een assetpad om te zetten naar een volledige URL.
 */

export function buildAssetUrl(assetPath, apiBaseUrl = "http://localhost:4000/api") {
  if (!assetPath) {
    return "";
  }

  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  const apiOrigin = apiBaseUrl.replace(/\/api$/, "");
  return `${apiOrigin}${assetPath}`;
}