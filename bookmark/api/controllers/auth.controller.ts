import { supabase } from "../supabase";

// SIGNUP
export const signup = async (req: any, res: any) => {
  const { email, password, handle } = req.body;

  // Check if handle already exists
  const { data: existingHandle } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle)
    .single();

  if (existingHandle) {
    return res.status(400).json({
      error: "Handle already exists",
    });
  }

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  // Save handle in profiles table
  await supabase.from("profiles").insert({
    id: data.user?.id,
    handle,
  });

  res.status(201).json({
    message:
      "Account created successfully. Please check your email and verify your account.",
    user: data.user,
  });
};

// LOGIN
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  if (!data.user.email_confirmed_at) {
    return res.status(401).json({
      error: "Please verify your email first",
    });
  }

  res.json(data);
};