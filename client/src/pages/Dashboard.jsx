/**
 * Dashboard voor adminbeheer.
 *
 * Belangrijk:
 * - paintings kunnen nu met bestand-upload worden aangemaakt of bijgewerkt
 * - bestaande paintings behouden hun huidige image-pad als er geen nieuw bestand gekozen wordt
 * - users blijven JSON-gebaseerd, omdat de bestaande tabel geen afbeelding ondersteunt
 */

import { useEffect, useMemo, useState } from "react";
import {
  buildAssetUrl,
  createPainting,
  createUser,
  deletePainting,
  deleteUser,
  getPaintings,
  getUsers,
  updatePainting,
  updateUser
} from "../services/api";

const emptyPaintingForm = {
  title: "",
  artist: "",
  ranking: "",
  description: "",
  ownerid: "",
  altText: "",
  imageFile: null
};

const emptyUserForm = {
  fname: "",
  lname: "",
  cname: "",
  admin: "false",
  username: "",
  password: ""
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("paintings");
  const [paintings, setPaintings] = useState([]);
  const [users, setUsers] = useState([]);
  const [paintingForm, setPaintingForm] = useState(emptyPaintingForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingPaintingId, setEditingPaintingId] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ownerOptions = useMemo(() => users, [users]);

  /**
   * Haalt paintings en users opnieuw op.
   */
  const loadData = async () => {
    try {
      setError("");

      const [paintingData, userData] = await Promise.all([
        getPaintings(),
        getUsers()
      ]);

      setPaintings(Array.isArray(paintingData) ? paintingData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetPaintingForm = () => {
    setPaintingForm(emptyPaintingForm);
    setEditingPaintingId("");
  };

  const resetUserForm = () => {
    setUserForm(emptyUserForm);
    setEditingUserId("");
  };

  /**
   * Verwerkt wijzigingen in het painting-formulier.
   *
   * Voor gewone velden gebruiken we tekstwaarden.
   * Voor imageFile gebruiken we het gekozen bestand.
   */
  const handlePaintingChange = (event) => {
    const { name, value, files, type } = event.target;

    setPaintingForm((previousState) => ({
      ...previousState,
      [name]: type === "file" ? files?.[0] || null : value
    }));
  };

  /**
   * Verwerkt wijzigingen in het user-formulier.
   */
  const handleUserChange = (event) => {
    setUserForm((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value
    }));
  };

  /**
   * Bouwt multipart/form-data op voor create/update van paintings.
   */
  const buildPaintingFormData = () => {
    const formData = new FormData();

    formData.append("title", paintingForm.title);
    formData.append("artist", paintingForm.artist);
    formData.append("ranking", paintingForm.ranking);
    formData.append("description", paintingForm.description);
    formData.append("ownerid", paintingForm.ownerid);
    formData.append("altText", paintingForm.altText);

    if (paintingForm.imageFile) {
      formData.append("image", paintingForm.imageFile);
    }

    return formData;
  };

  /**
   * Painting aanmaken of updaten.
   */
  const handlePaintingSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage("");
      setError("");

      const formData = buildPaintingFormData();

      if (editingPaintingId) {
        await updatePainting(editingPaintingId, formData);
        setMessage("Painting updated successfully.");
      } else {
        await createPainting(formData);
        setMessage("Painting created successfully.");
      }

      resetPaintingForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save painting");
    }
  };

  /**
   * User aanmaken of updaten.
   */
  const handleUserSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage("");
      setError("");

      if (editingUserId) {
        const payload = { ...userForm };

        if (!payload.password.trim()) {
          delete payload.password;
        }

        await updateUser(editingUserId, payload);
        setMessage("User updated successfully.");
      } else {
        await createUser(userForm);
        setMessage("User created successfully.");
      }

      resetUserForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save user");
    }
  };

  /**
   * Zet paintinggegevens in het formulier voor bewerken.
   *
   * Let op:
   * - imageFile blijft null totdat de admin echt een nieuw bestand kiest.
   */
  const startEditPainting = (painting) => {
    setActiveTab("paintings");
    setEditingPaintingId(painting.id);

    setPaintingForm({
      title: painting.title || "",
      artist: painting.artist || "",
      ranking: painting.ranking || "",
      description: painting.description || "",
      ownerid: painting.ownerid || "",
      altText: painting.altText || "",
      imageFile: null
    });
  };

  /**
   * Zet usergegevens in het formulier voor bewerken.
   */
  const startEditUser = (user) => {
    setActiveTab("users");
    setEditingUserId(user.id);

    setUserForm({
      fname: user.fname || "",
      lname: user.lname || "",
      cname: user.cname || "",
      admin: user.admin || "false",
      username: user.username || "",
      password: ""
    });
  };

  /**
   * Painting verwijderen.
   */
  const handleDeletePainting = async (id) => {
    try {
      setMessage("");
      setError("");

      await deletePainting(id);
      setMessage("Painting deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete painting");
    }
  };

  /**
   * User verwijderen.
   */
  const handleDeleteUser = async (id) => {
    try {
      setMessage("");
      setError("");

      await deleteUser(id);
      setMessage("User deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Administration</p>
          <h1>Collection dashboard</h1>
          <p className="section-text">
            Manage paintings and user accounts from one secure admin panel.
          </p>
        </div>

        <div className="tab-row">
          <button
            className={activeTab === "paintings" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("paintings")}
            type="button"
          >
            Paintings
          </button>

          <button
            className={activeTab === "users" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("users")}
            type="button"
          >
            Users
          </button>
        </div>

        {message && <p className="status-message success-message">{message}</p>}
        {error && <p className="status-message error-message">{error}</p>}

        {activeTab === "paintings" && (
          <div className="dashboard-grid">
            <div className="museum-panel">
              <h2>{editingPaintingId ? "Edit painting" : "Add painting"}</h2>

              <form className="form-grid" onSubmit={handlePaintingSubmit}>
                <div className="form-field">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    value={paintingForm.title}
                    onChange={handlePaintingChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="artist">Artist</label>
                  <input
                    id="artist"
                    name="artist"
                    value={paintingForm.artist}
                    onChange={handlePaintingChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="ranking">Ranking</label>
                  <input
                    id="ranking"
                    name="ranking"
                    value={paintingForm.ranking}
                    onChange={handlePaintingChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="ownerid">Owner</label>
                  <select
                    id="ownerid"
                    name="ownerid"
                    value={paintingForm.ownerid}
                    onChange={handlePaintingChange}
                  >
                    <option value="">No owner selected</option>
                    {ownerOptions.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="altText">Alt text</label>
                  <input
                    id="altText"
                    name="altText"
                    value={paintingForm.altText}
                    onChange={handlePaintingChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="imageFile">
                    {editingPaintingId ? "Nieuwe afbeelding (optioneel)" : "Afbeelding"}
                  </label>
                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handlePaintingChange}
                  />
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={paintingForm.description}
                    onChange={handlePaintingChange}
                  />
                </div>

                <div className="button-row">
                  <button className="primary-button" type="submit">
                    {editingPaintingId ? "Update painting" : "Create painting"}
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={resetPaintingForm}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="museum-panel">
              <h2>Painting list</h2>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Ranking</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paintings.map((painting) => (
                      <tr key={painting.id}>
                        <td>
                          <img
                            src={
                              buildAssetUrl(painting.image) ||
                              "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=300&q=80"
                            }
                            alt={painting.altText || painting.title || "Painting"}
                            className="dashboard-thumbnail"
                            onError={(event) => {
                              event.currentTarget.src =
                                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=300&q=80";
                            }}
                          />
                        </td>
                        <td>{painting.title}</td>
                        <td>{painting.artist}</td>
                        <td>{painting.ranking}</td>
                        <td className="actions-cell">
                          <button
                            className="table-button"
                            onClick={() => startEditPainting(painting)}
                            type="button"
                          >
                            Edit
                          </button>

                          <button
                            className="table-button danger"
                            onClick={() => handleDeletePainting(painting.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {paintings.length === 0 && (
                      <tr>
                        <td colSpan="5">No paintings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="dashboard-grid">
            <div className="museum-panel">
              <h2>{editingUserId ? "Edit user" : "Add user"}</h2>

              <form className="form-grid" onSubmit={handleUserSubmit}>
                <div className="form-field">
                  <label htmlFor="fname">First name</label>
                  <input
                    id="fname"
                    name="fname"
                    value={userForm.fname}
                    onChange={handleUserChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="lname">Last name</label>
                  <input
                    id="lname"
                    name="lname"
                    value={userForm.lname}
                    onChange={handleUserChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="cname">Display name</label>
                  <input
                    id="cname"
                    name="cname"
                    value={userForm.cname}
                    onChange={handleUserChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    value={userForm.username}
                    onChange={handleUserChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password">
                    Password {editingUserId ? "(leave blank to keep current password)" : ""}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={userForm.password}
                    onChange={handleUserChange}
                    required={!editingUserId}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="admin">Admin</label>
                  <select
                    id="admin"
                    name="admin"
                    value={userForm.admin}
                    onChange={handleUserChange}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div className="button-row">
                  <button className="primary-button" type="submit">
                    {editingUserId ? "Update user" : "Create user"}
                  </button>

                  <button
                    className="secondary-button"
                    type="button"
                    onClick={resetUserForm}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="museum-panel">
              <h2>User list</h2>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Admin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{[user.fname, user.lname].filter(Boolean).join(" ") || "-"}</td>
                        <td>{user.admin === "true" ? "Yes" : "No"}</td>
                        <td className="actions-cell">
                          <button
                            className="table-button"
                            onClick={() => startEditUser(user)}
                            type="button"
                          >
                            Edit
                          </button>

                          <button
                            className="table-button danger"
                            onClick={() => handleDeleteUser(user.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;