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
  const [isMobileHidden, setIsMobileHidden] = useState(true);
  const [isMobileView, setIsMobileView] = useState(true);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    
    // Handler function
    const handleViewportChange = (e) => {
      setResponsive(e.matches);
      setIsMobileView(e.matches);
    };

    // Initial check
    handleViewportChange(mediaQuery);
    
    // Add listener for changes
    mediaQuery.addEventListener('change', handleViewportChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setUserLoged(session.session !== null);
    };

    checkSession();
  }, []);

  const sidebarWidth = responsive ? 80 : 240;

  const handleMobileHiddenChange = (hidden) => {
    setIsMobileHidden(hidden);
  };

  const getMarginLeft = () => {
    if (isMobileView) {
      return isMobileHidden ? '30px' : `${sidebarWidth + 20}px`;
    }
    return `${sidebarWidth + 20}px`;
  };

  return (
    <div className="flex font-inter">
      {userLoged ? (
        <>
          <div className={`fixed ${ isMobileView && isMobileHidden ? '-translate-x-full' : '-translate-x-4'} transition-transform duration-300`}>
            <Sidebar 
              responsive={responsive} 
              setResponsive={setResponsive}
              onMobileHiddenChange={handleMobileHiddenChange}
            />
          </div>
          <div 
            className="flex-1 overflow-hidden mr-[30px] transition-all duration-300 ease-in-out"
            style={{ marginLeft: getMarginLeft() }}
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