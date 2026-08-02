import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { profileService } from "../services/profileService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUserAndProfile = async (sessionUser) => {
      if (!sessionUser) {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
      }

      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        const activeUser = authUser ?? sessionUser;

        if (!activeUser?.id) {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        let profileData = null;

        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", activeUser.id)
            .maybeSingle();

          if (error && error.code !== "PGRST116") {
            throw error;
          }

          profileData = data ?? null;
        } catch (profileError) {
          console.error("Unable to fetch profile row:", profileError);
        }

        if (!profileData) {
          profileData = await profileService.ensureProfile(activeUser);
        }

        if (isMounted) {
          setUser(activeUser);
          setProfile(profileData ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Unable to load authenticated user profile:", error);

        if (isMounted) {
          setUser(sessionUser ?? null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    loadUserAndProfile(null);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      loadUserAndProfile(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

