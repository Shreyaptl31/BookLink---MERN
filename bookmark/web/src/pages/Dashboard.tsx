import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  is_public: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "public" | "private">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchBookmarks();

    if (!document.getElementById("bs-cdn")) {
      const link = document.createElement("link");
      link.id = "bs-cdn";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("bi-cdn")) {
      const link = document.createElement("link");
      link.id = "bi-cdn";
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("bl-fonts")) {
      const link = document.createElement("link");
      link.id = "bl-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookmarks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load bookmarks. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required.");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const endpoint = editingId
        ? `${import.meta.env.VITE_API_URL}/bookmarks/${editingId}`
        : `${import.meta.env.VITE_API_URL}/bookmarks`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          url,
          is_public: isPublic,
        }),
      });

      if (response.ok) {
        setTitle("");
        setUrl("");
        setIsPublic(false);
        setEditingId(null);
        setShowAddForm(false);

        showSuccess(editingId ? "Bookmark updated." : "Bookmark saved.");

        await fetchBookmarks();
      } else {
        setError("Failed to save bookmark.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const editBookmark = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setIsPublic(bookmark.is_public);
    setShowAddForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setIsPublic(false);
    setError("");
    setShowAddForm(false);
  };

  const deleteBookmark = async (id: string) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/bookmarks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccess("Bookmark removed.");
      await fetchBookmarks();
    } catch {
      setError("Could not delete bookmark.");
    } finally {
      setDeletingId(null);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getDomain = (rawUrl: string) => {
    try {
      return new URL(rawUrl).hostname.replace("www.", "");
    } catch {
      return rawUrl;
    }
  };

  const filtered = bookmarks.filter((b) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "public" && b.is_public) ||
      (activeTab === "private" && !b.is_public);
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const publicCount = bookmarks.filter((b) => b.is_public).length;
  const privateCount = bookmarks.filter((b) => !b.is_public).length;

  return (
    <>
      <div className="bl-app">
        {/* ── Sidebar ── */}
        <aside className="bl-sidebar">
          <div>
            <div className="bl-logo">
              Book<span>Link</span>
            </div>
            <div className="bl-tagline">Your personal web, catalogued</div>
          </div>

          {/* Shelf / stats */}
          <div className="bl-shelf">
            <div className="bl-shelf-row">
              <span className="bl-shelf-label">Total saved</span>
              <span className="bl-shelf-value">{bookmarks.length}</span>
            </div>
            <div className="bl-shelf-bar">
              <div
                className="bl-shelf-bar-public"
                style={{
                  width: bookmarks.length
                    ? `${(publicCount / bookmarks.length) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <div className="bl-shelf-legend">
              <span>
                <i className="bi bi-circle-fill" /> {publicCount} public
              </span>
              <span>
                <i className="bi bi-circle-fill" /> {privateCount} private
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="bl-nav">
            {(["all", "public", "private"] as const).map((tab) => (
              <button
                key={tab}
                className={`bl-nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <i
                  className={`bi bi-${
                    tab === "all"
                      ? "grid"
                      : tab === "public"
                        ? "globe2"
                        : "lock-fill"
                  }`}
                />
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="bl-nav-count">
                  {tab === "all"
                    ? bookmarks.length
                    : tab === "public"
                      ? publicCount
                      : privateCount}
                </span>
              </button>
            ))}
          </nav>

          <button className="bl-logout-btn" onClick={logout}>
            <i className="bi bi-box-arrow-left" />
            Sign out
          </button>
        </aside>

        {/* ── Main content ── */}
        <main className="bl-content">
          <div className="bl-topbar">
            <div className="bl-search">
              <i className="bi bi-search search-icon" />
              <input
                type="text"
                placeholder="Search bookmarks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className={`bl-quickadd-toggle ${showAddForm ? "active" : ""}`}
              onClick={() => {
                if (showAddForm) cancelEdit();
                else setShowAddForm(true);
              }}
            >
              <i className={`bi ${showAddForm ? "bi-x-lg" : "bi-plus-lg"}`} />
              {showAddForm ? "Close" : "Add bookmark"}
            </button>
          </div>

          <div className="p-3 p-md-4">
            {/* Add Bookmark panel */}
            {showAddForm && (
              <div className="bl-add-panel">
                <div className="section-label">
                  <i
                    className={`bi ${editingId ? "bi-pencil-square" : "bi-bookmark-plus"} me-1`}
                  />
                  {editingId ? "Edit bookmark" : "Add a bookmark"}
                </div>

                {error && (
                  <div className="bl-error mb-3">
                    <i className="bi bi-exclamation-circle" />
                    {error}
                  </div>
                )}

                <div className="row g-3 align-items-end">
                  <div className="col-12 col-sm-4">
                    <div className="bl-field">
                      <label>Title</label>
                      <input
                        type="text"
                        placeholder="e.g. React Docs"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setError("");
                        }}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="bl-field">
                      <label>URL</label>
                      <input
                        type="text"
                        placeholder="https://…"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setError("");
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-2 col-6">
                    <label className="bl-toggle">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <span className="track" />
                      <span className="toggle-label">Public</span>
                    </label>
                  </div>
                  <div className="col-12 col-sm-2 col-6 d-flex gap-2">
                    {editingId && (
                      <button className="bl-cancel-btn" onClick={cancelEdit}>
                        <i className="bi bi-x" />
                      </button>
                    )}
                    <button
                      className="bl-add-btn flex-grow-1"
                      onClick={addBookmark}
                      disabled={adding}
                    >
                      {adding ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            style={{ width: "0.85rem", height: "0.85rem" }}
                          />
                          Saving…
                        </>
                      ) : (
                        <>
                          <i
                            className={`bi ${
                              editingId ? "bi-check-circle" : "bi-bookmark-plus"
                            }`}
                          />
                          {editingId ? "Update" : "Save"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid meta */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="bl-result-meta mb-0">
                {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
                {activeTab !== "all" && ` · ${activeTab}`}
                {search && ` matching "${search}"`}
              </p>
            </div>

            {/* Bookmark grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="bl-spinner" />
                <p className="bl-loading-text">Loading bookmarks…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bl-empty">
                <i className="bi bi-bookmark-x" />
                <p className="bl-empty-title">
                  {search ? "No results found" : "No bookmarks yet"}
                </p>
                <p className="bl-empty-sub">
                  {search
                    ? "Try a different search term"
                    : "Add your first bookmark to start your catalogue"}
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {filtered.map((bookmark) => (
                  <div className="col-12 col-sm-6 col-xl-4" key={bookmark.id}>
                    <div
                      className={`bl-bookmark-card h-100 ${
                        bookmark.is_public ? "is-public" : "is-private"
                      }`}
                    >
                      <div className="bl-card-tab" />
                      <div className="bl-card-body">
                        <div className="bl-card-row">
                          <div className="bl-favicon">
                            {getDomain(bookmark.url).charAt(0).toUpperCase()}
                          </div>
                          <div className="bl-card-info">
                            <div
                              className="bl-card-title"
                              title={bookmark.title}
                            >
                              {bookmark.title}
                            </div>
                            <a
                              href={bookmark.url}
                              className="bl-card-url"
                              target="_blank"
                              rel="noreferrer"
                              title={bookmark.url}
                            >
                              {getDomain(bookmark.url)}
                            </a>
                          </div>
                          <div className="bl-card-actions">
                            <button
                              className="bl-icon-btn"
                              onClick={() => editBookmark(bookmark)}
                              title="Edit bookmark"
                            >
                              <i className="bi bi-pencil-square" />
                            </button>
                            <button
                              className="bl-icon-btn danger"
                              onClick={() => deleteBookmark(bookmark.id)}
                              disabled={deletingId === bookmark.id}
                              title="Remove bookmark"
                            >
                              {deletingId === bookmark.id ? (
                                <span className="bl-mini-spinner" />
                              ) : (
                                <i className="bi bi-trash3" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="bl-card-footer">
                          <span
                            className={
                              bookmark.is_public
                                ? "bl-badge-public"
                                : "bl-badge-private"
                            }
                          >
                            <i
                              className={`bi bi-${
                                bookmark.is_public ? "globe2" : "lock-fill"
                              } me-1`}
                            />
                            {bookmark.is_public ? "Public" : "Private"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="bl-toast">
          <i className="bi bi-check-circle-fill" />
          {successMsg}
        </div>
      )}
    </>
  );
};

export default Dashboard;
