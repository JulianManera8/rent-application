'use client'

import { Outlet } from "@remix-run/react";
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
  const [responsive, setResponsive] = useState(false)
  const [userLoged, setUserLoged] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setResponsive(window.innerWidth <= 900)
    }

    handleResize() // Call it initially
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setUserLoged(session.session !== null);
    };

    checkSession();
  }, []);

  const sidebarWidth = responsive ? 80 : 256; // Width in pixels

  return (
    <div className="flex font-inter">
      {userLoged ? (
        <>
          <div className="fixed">
            <Sidebar responsive={responsive} setResponsive={setResponsive}/>
          </div>
          <div 
            className="flex-1 overflow-hidden overflow-x-auto mr-[30px] transition-[margin-left] duration-300 ease-in-out"
            style={{ marginLeft: `${sidebarWidth + 30 }px` }}
          >
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