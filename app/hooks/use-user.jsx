import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export function useUser() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
      if (error) console.error("Error al obtener el usuario:", error);
    };

    fetchUser();
  }, []);

  return userId;
}