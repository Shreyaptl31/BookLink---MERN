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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/bookmarks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setBookmarks(data);
  };

  const addBookmark = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/bookmarks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          url,
          is_public: isPublic,
        }),
      }
    );

    if (response.ok) {
      setTitle("");
      setUrl("");
      setIsPublic(false);
      fetchBookmarks();
    }
  };

  const deleteBookmark = async (id: string) => {
    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/bookmarks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBookmarks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h1>BookLink</h1>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      <div className="add-bookmark">
        <h2>Add Bookmark</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) =>
              setIsPublic(e.target.checked)
            }
          />
          Public Bookmark
        </label>

        <button onClick={addBookmark}>
          Add Bookmark
        </button>
      </div>

      <div className="bookmarks">
        <h2>My Bookmarks</h2>

        {bookmarks.map((bookmark) => (
          <div className="card" key={bookmark.id}>
            <h3>{bookmark.title}</h3>

            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
            >
              {bookmark.url}
            </a>

            <p>
              {bookmark.is_public
                ? "🌍 Public"
                : "🔒 Private"}
            </p>

            <button
              className="delete-btn"
              onClick={() =>
                deleteBookmark(bookmark.id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;