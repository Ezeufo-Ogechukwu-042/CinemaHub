import { supabase } from "../supabase/client";

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  },

  async ensureProfile(user) {
    if (!user?.id) {
      return null;
    }

    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingProfile) {
      return existingProfile;
    }

    const profilePayload = {
      id: user.id,
      email: user.email || null,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      role: "user",
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(profilePayload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
},

async uploadAvatar(userId, file) {
    const fileExt = file.name.split(".").pop();

    const fileName = `${userId}/avatar.${fileExt}`;

    const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
            upsert: true,
        });

    if (error) throw error;

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

    return data.publicUrl;
},

};