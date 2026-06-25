import { supabase } from "@/app/connection/supabaseclient";

export type UpdateUserProfileData = {
  Name?: string;
  Surname?: string;
  Username?: string;
};

export async function updateUserProfile(
  userId: string,
  profileData: UpdateUserProfileData
) {
  const { data, error } = await supabase
    .from("Users")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}