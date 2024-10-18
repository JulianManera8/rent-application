/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from "@remix-run/react";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import NoAuth from '../components/noAuth'

async function getSession() {
  const {data, error} = await supabase.auth.getSession();

  if(error) {console.error(error)}

  return data
}

export default function DashboardIndexPage() {
  const navigate = useNavigate();
  const [userLoged, setUserLoged] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (session.session === null) {
        return setUserLoged(false);
      }

      setUserLoged(true);
    };

    checkSession();
  }, []);

  return (
    <div className="flex font-inter">
      {userLoged ? (
        <>
          <div className="fixed">
            <Sidebar />
          </div>
          <div className="ml-[350px] flex flex-1 overflow-hidden">
            <Outlet />
          </div>
        </>
      ) : (
        <div className="mx-auto">
          <NoAuth />
        </div>
      )}
    </div>
  );
}
