import { supabase, supabaseAdmin } from "../supabase";

// SIGNUP
export const signup = async (req: any, res: any) => {
  const { email, password, handle } = req.body;

  if (!handle || !email || !password) {
    return res.status(400).json({ error: "Email, password, and handle are required" });
  }

  const { data: existingHandle } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();

  if (existingHandle) {
    return res.status(400).json({ error: "Handle already exists" });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { handle } },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data.user) {
    return res.status(500).json({ error: "Signup failed — no user returned" });
  }


  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: data.user.id,
    handle,
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    console.error("Profile insert failed, rolled back auth user:", profileError);
    return res.status(500).json({ error: "Failed to create profile. Please try again." });
  }

  res.status(201).json({
    message: "Account created successfully. Please check your email and verify your account.",
    user: data.user,
  });
};

// LOGIN
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data.user.email_confirmed_at) {
    return res.status(401).json({ error: "Please verify your email first" });
  }


  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    const handle = data.user.user_metadata?.handle;
    if (handle) {
      const { error: healError } = await supabaseAdmin
        .from("profiles")
        .insert({ id: data.user.id, handle });
      if (healError) {
        console.error("Self-heal profile insert failed:", healError);
      }
    } else {
      console.warn(`User ${data.user.id} has no profile and no handle in metadata`);
    }
  }

  res.json(data);
};