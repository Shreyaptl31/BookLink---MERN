import { supabase } from "../supabase";

// GET MY BOOKMARKS
export const getBookmarks = async (req: any, res: any) => {
  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
};

// CREATE BOOKMARK
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

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
};

// UPDATE MY BOOKMARK
export const updateBookmark = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, url, is_public } = req.body;

  const user_id = req.user.id;

  const { data, error } = await supabase
    .from("bookmarks")
    .update({
      title,
      url,
      is_public,
    })
    .eq("id", id)
    .eq("user_id", user_id)
    .select();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
};

// DELETE MY BOOKMARK
export const deleteBookmark = async (req: any, res: any) => {
  const { id } = req.params;

  const user_id = req.user.id;

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    message: "Deleted successfully",
  });
};

// PUBLIC PROFILE
export const getPublicProfile = async (
  req: any,
  res: any
) => {
  const { handle } = req.params;

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("handle", handle)
      .single();

  if (profileError || !profile) {
    return res.status(404).json({
      error: "Profile not found",
    });
  }

  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    handle: profile.handle,
    full_name: profile.full_name ?? null,   // ← now included
    avatar_url: profile.avatar_url ?? null,
    bookmarks,
  });
};