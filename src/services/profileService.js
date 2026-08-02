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