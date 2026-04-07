/**
 * Centrale API-laag voor de frontend.
 *
 * Belangrijke punten:
 * - API_BASE_URL wijst naar de backend-API
 * - buildAssetUrl wordt centraal hergebruikt vanuit ../utils/buildAssetUrl
 * - dit werkt zowel voor bestaande paden zoals /assets/img/...
 *   als voor nieuwe uploads onder /assets/uploads/...
 */

import { buildAssetUrl as buildAssetUrlHelper } from "../utils/buildAssetUrl";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

/**
 * Bouwt auth-headers op als er een JWT-token aanwezig is.
 */
function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders
  };
}

/**
 * Probeert de backendresponse veilig te parsen.
 */
async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

/**
 * Algemene request helper.
 */
async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error("Cannot connect to the backend. Make sure the server is running on port 4000.");
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.error || data || "Request failed");
  }

  return data;
}

/**
 * Zet een relatieve afbeeldings- of assetwaarde om naar een volledige URL.
 *
 * Voorbeelden:
 * - /assets/img/The_Mona_Lisa.jpg
 * - /assets/img/initials/Starry_Night.jpg
 * - /assets/uploads/1719999999999-custom.jpg
 *
 * Externe URLs laten we ongemoeid.
 */
export function buildAssetUrl(assetPath) {
  return buildAssetUrlHelper(assetPath, API_BASE_URL);
}

/**
 * Loginrequest.
 */
export function loginRequest(credentials) {
  return request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
}

/**
 * Paintings ophalen.
 */
export function getPaintings() {
  return request("/paintings", {
    method: "GET"
  });
}

/**
 * Painting aanmaken met multipart/form-data.
 */
export function createPainting(formData) {
  return request("/paintings", {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData
  });
}

/**
 * Painting updaten met multipart/form-data.
 */
export function updatePainting(id, formData) {
  return request(`/paintings/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData
  });
}

/**
 * Painting verwijderen.
 */
export function deletePainting(id) {
  return request(`/paintings/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
}

/**
 * Reset alle paintings naar de oorspronkelijke dataset.
 *
 * Alleen bedoeld voor admins.
 */
export function resetPaintingsToInitialDataset() {
  return request("/paintings/reset", {
    method: "POST",
    headers: getAuthHeaders()
  });
}

/**
 * Users ophalen.
 */
export function getUsers() {
  return request("/users", {
    method: "GET",
    headers: getAuthHeaders()
  });
}

/**
 * User aanmaken.
 */
export function createUser(payload) {
  return request("/users", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

/**
 * User updaten.
 */
export function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

/**
 * User verwijderen.
 */
export function deleteUser(id) {
  return request(`/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
}