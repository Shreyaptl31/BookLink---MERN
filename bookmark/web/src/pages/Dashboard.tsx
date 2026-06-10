import { useEffect, useState } from "react";
import API from "../api/api";

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

interface Props {
  token: string;
}

export default function Dashboard({ token }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchBookmarks = async () => {
    const res = await API.get("/bookmarks", { headers });
    setBookmarks(res.data);
  };

  const addBookmark = async () => {
    await API.post(
      "/bookmarks",
      { title, url, is_public: true },
      { headers }
    );

    fetchBookmarks();
  };

  const deleteBookmark = async (id: string) => {
    await API.delete(`/bookmarks/${id}`, { headers });
    fetchBookmarks();
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="URL"
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={addBookmark}>Add</button>

      <ul>
        {bookmarks.map((b) => (
          <li key={b.id}>
            {b.title} - {b.url}
            <button onClick={() => deleteBookmark(b.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}