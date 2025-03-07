import { createContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/component";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    supabase.auth
      .getSession()
      .then((obj) => {
        const session = obj.data.session.user.id;
        return supabase.from("profiles").select().eq("id", session);
      })
      .then((result) => setProfile(result.data[0]));
  }, []);
  return (
    <UserContext.Provider value={profile}>{children}</UserContext.Provider>
  );
}
