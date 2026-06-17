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
  // const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "public" | "private">("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // try {
    //   const payload = JSON.parse(atob(token.split(".")[1]));
    //   setUsername(payload.username || payload.name || payload.sub || payload.email || "User");
    // } catch {
    //   setUsername("User");
    // }

    fetchBookmarks();

    if (!document.getElementById("bs-cdn")) {
      const link = document.createElement("link");
      link.id = "bs-cdn";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("bi-cdn")) {
      const link = document.createElement("link");
      link.id = "bi-cdn";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css";
      document.head.appendChild(link);
    }
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await fetch("http://localhost:5000/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, url, is_public: isPublic }),
      });
      if (response.ok) {
        setTitle("");
        setUrl("");
        setIsPublic(false);
        showSuccess("Bookmark saved!");
        await fetchBookmarks();
      } else {
        setError("Failed to add bookmark.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const deleteBookmark = async (id: string) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/bookmarks/${id}`, {
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

  // const getInitials = (name: string) =>
  //   name
  //     .split(/[\s._@]+/)
  //     .slice(0, 2)
  //     .map((p) => p[0]?.toUpperCase() ?? "")
  //     .join("");

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
            <div className="bl-logo">Book<span>Link</span></div>
            <div className="bl-tagline">Your personal web</div>
          </div>

          {/* Stats */}
          <div className="stats-group mb-3">
            <div className="bl-stat-card">
              <div className="bl-stat-label">Total saved</div>
              <div className="bl-stat-value indigo">{bookmarks.length}</div>
            </div>
            <div className="row g-2">
              <div className="col-6">
                <div className="bl-stat-card">
                  <div className="bl-stat-label">Public</div>
                  <div className="bl-stat-value green">{publicCount}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bl-stat-card">
                  <div className="bl-stat-label">Private</div>
                  <div className="bl-stat-value amber">{privateCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="d-flex flex-column gap-1 mb-3">
            {(["all", "public", "private"] as const).map((tab) => (
              <button
                key={tab}
                className={`bl-nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <i className={`bi bi-${tab === "all" ? "grid" : tab === "public" ? "globe" : "lock"}`} />
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="badge-count">
                  {tab === "all" ? bookmarks.length : tab === "public" ? publicCount : privateCount}
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
          </div>

          <div className="p-3 p-md-4">

            {/* Add Bookmark panel */}
            <div className="bl-add-panel">
              <div className="section-label">
                <i className="bi bi-plus-circle me-1" />
                Add bookmark
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
                      onChange={(e) => { setTitle(e.target.value); setError(""); }}
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
                      onChange={(e) => { setUrl(e.target.value); setError(""); }}
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-2 d-flex align-items-center" style={{ paddingBottom: "0.1rem" }}>
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
                <div className="col-12 col-sm-2">
                  <button
                    className="bl-add-btn w-100"
                    onClick={addBookmark}
                    disabled={adding}
                  >
                    {adding ? (
                      <>
                        <span className="spinner-border spinner-border-sm" style={{ width: "0.85rem", height: "0.85rem" }} />
                        Saving…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-bookmark-plus" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Grid meta */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="mb-0" style={{ fontSize: "0.82rem", color: "#64748B", fontWeight: 500 }}>
                {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
                {activeTab !== "all" && ` · ${activeTab}`}
                {search && ` matching "${search}"`}
              </p>
            </div>

            {/* Bookmark grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: "var(--bl-indigo)", width: "1.75rem", height: "1.75rem" }} />
                <p className="mt-2" style={{ fontSize: "0.82rem", color: "#94A3B8" }}>Loading bookmarks…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bl-empty">
                <i className="bi bi-bookmark-x" />
                <p className="mb-1" style={{ fontWeight: 600, color: "#475569" }}>
                  {search ? "No results found" : "No bookmarks yet"}
                </p>
                <p style={{ fontSize: "0.82rem" }}>
                  {search ? "Try a different search term" : "Add your first bookmark above"}
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {filtered.map((bookmark) => (
                  <div className="col-12 col-sm-6 col-xl-4" key={bookmark.id}>
                    <div className="bl-bookmark-card h-100">
                      <div className="d-flex align-items-start gap-2">
                        <div className="bl-favicon">
                          {getDomain(bookmark.url).charAt(0)}
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="bl-card-title" title={bookmark.title}>
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
                        <button
                          className="bl-delete-btn"
                          onClick={() => deleteBookmark(bookmark.id)}
                          disabled={deletingId === bookmark.id}
                          title="Remove bookmark"
                        >
                          {deletingId === bookmark.id ? (
                            <span className="spinner-border spinner-border-sm" style={{ width: "0.7rem", height: "0.7rem" }} />
                          ) : (
                            <i className="bi bi-trash3" />
                          )}
                        </button>
                      </div>
                      <div className="mt-2">
                        <span className={bookmark.is_public ? "bl-badge-public" : "bl-badge-private"}>
                          <i
                            className={`bi bi-${bookmark.is_public ? "globe2" : "lock-fill"} me-1`}
                            style={{ fontSize: "0.6rem" }}
                          />
                          {bookmark.is_public ? "Public" : "Private"}
                        </span>
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