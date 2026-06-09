import { supabase } from "../supabase";

// GET ALL
export const getBookmarks = async (req: any, res: any) => {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// CREATE
export const createBookmark = async (req: any, res: any) => {
  const { title, url, is_public } = req.body;

  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([
      {
        title,
        url,
        is_public,
        user_id,
      },
    ])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// UPDATE
export const updateBookmark = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, url, is_public } = req.body;

  const { data, error } = await supabase
    .from("bookmarks")
    .update({ title, url, is_public })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// DELETE
export const deleteBookmark = async (req: any, res: any) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Deleted successfully" });
};