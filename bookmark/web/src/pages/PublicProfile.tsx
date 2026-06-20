import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PublicProfile.css";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

interface Profile {
  handle: string;
  full_name: string | null;
  avatar_url: string | null;
  bookmarks: Bookmark[];
}

const PublicProfile = () => {
  const { handle } = useParams();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
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

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/bookmarks/${handle}`,
        );

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [handle]);

  const getDomain = (rawUrl: string) => {
    try {
      const withProtocol = rawUrl.startsWith("http")
        ? rawUrl
        : `https://${rawUrl}`;
      return new URL(withProtocol).hostname.replace("www.", "");
    } catch {
      return rawUrl;
    }
  };

  if (loading) {
    return (
      <div className="bl-pp-page bl-pp-center">
        <div className="bl-spinner" />
        <p className="bl-loading-text">Loading profile…</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="bl-pp-page bl-pp-center">
        <div className="bl-empty">
          <i className="bi bi-person-x" />
          <p className="bl-empty-title">Profile not found</p>
          <p className="bl-empty-sub">
            There's no public catalogue at this handle.
          </p>
        </div>
      </div>
    );
  }

  const filtered = profile.bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bl-pp-page">
      {/* ── Topbar ── */}
      <header className="bl-pp-topbar">
        <div className="bl-logo">
          Book<span>Link</span>
        </div>
        <span className="bl-pp-topbar-tag">Public profile</span>
      </header>

      <div className="bl-pp-wrap">
        {/* ── Profile header ── */}
        <div className="bl-pp-hero">
          <img
            src={
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${profile.handle}&background=6C63FF&color=fff`
            }
            alt={profile.handle}
            className="bl-pp-avatar"
          />

          <div className="bl-pp-hero-info">
            <h1 className="bl-pp-name">
              {profile.full_name || profile.handle}
            </h1>
            <p className="bl-pp-handle">@{profile.handle}</p>
          </div>

          {/* Shelf stat, same component as the dashboard sidebar */}
          <div className="bl-shelf bl-pp-shelf">
            <div className="bl-shelf-row">
              <span className="bl-shelf-label">Public bookmarks</span>
              <span className="bl-shelf-value">{profile.bookmarks.length}</span>
            </div>
            <div className="bl-shelf-bar">
              <div className="bl-shelf-bar-public" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        {profile.bookmarks.length > 0 && (
          <div className="bl-pp-search-row">
            <div className="bl-search bl-pp-search">
              <i className="bi bi-search search-icon" />
              <input
                type="text"
                placeholder="Search this catalogue…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="bl-result-meta">
              {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </p>
          </div>
        )}

        {/* ── Bookmarks grid, same cards as the dashboard ── */}
        {profile.bookmarks.length === 0 ? (
          <div className="bl-empty">
            <i className="bi bi-bookmark-x" />
            <p className="bl-empty-title">No public bookmarks yet</p>
            <p className="bl-empty-sub">
              Check back once {profile.handle} shares something.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bl-empty">
            <i className="bi bi-bookmark-x" />
            <p className="bl-empty-title">No results found</p>
            <p className="bl-empty-sub">Try a different search term</p>
          </div>
        ) : (
          <div className="bl-pp-grid">
            {filtered.map((bookmark) => (
              <div className="bl-bookmark-card is-public" key={bookmark.id}>
                <div className="bl-card-tab" />
                <div className="bl-card-body">
                  <div className="bl-card-row">
                    <div className="bl-favicon">
                      {getDomain(bookmark.url).charAt(0).toUpperCase()}
                    </div>
                    <div className="bl-card-info">
                      <div className="bl-card-title" title={bookmark.title}>
                        {bookmark.title}
                      </div>
                      <span className="bl-card-url">
                        {getDomain(bookmark.url)}
                      </span>
                    </div>
                    <a
                      href={
                        bookmark.url.startsWith("http")
                          ? bookmark.url
                          : `https://${bookmark.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="bl-icon-btn bl-pp-visit"
                      title="Visit site"
                    >
                      <i className="bi bi-arrow-up-right" />
                    </a>
                  </div>
                  <div className="bl-card-footer">
                    <span className="bl-badge-public">
                      <i className="bi bi-globe2 me-1" />
                      Public
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bl-pp-footer">
          <i className="bi bi-bookmark-heart" /> Catalogued with BookLink
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;