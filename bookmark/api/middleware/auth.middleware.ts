import { supabase } from "../supabase";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = data.user; // 👈 attach user to request

    next();
  } catch (err) {
    return res.status(500).json({ error: "Auth failed" });
  }
};