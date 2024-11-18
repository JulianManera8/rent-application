'use client'

import { Outlet } from "@remix-run/react";
import Sidebar from "../components/layout/Sidebar";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import NoAuth from '../components/auth/noAuth'

async function getSession() {
  const {data, error} = await supabase.auth.getSession();
  if(error) {console.error(error)}
  return data
}

export default function DashboardIndexPage() {
  const [responsive, setResponsive] = useState(false)
  const [userLoged, setUserLoged] = useState(false);
  const [isMobileHidden, setIsMobileHidden] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia('(max-width: 601px)');
    
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

  const sidebarWidth = responsive ? (isMobileHidden ? 0 : 80 ) : 240;

  const handleMobileHiddenChange = (hidden) => {
    setIsMobileHidden(hidden);
  };

  const getMarginLeft = () => {
    if (isMobileView) {
      return isMobileHidden ? (responsive ? '' : '') : ``;
    }

    if(responsive) {
      return '100px' 
    }

    return `${sidebarWidth + 20}px`;
  };

  return (
    <div className="flex font-inter">
      {userLoged ? (
        <>
          <div className={`fixed ${isMobileView && isMobileHidden ? '-translate-x-full' : '-translate-x-0'} transition-transform duration-300 z-50`}>
            <Sidebar 
              responsive={responsive} 
              setResponsive={setResponsive}
              onMobileHiddenChange={handleMobileHiddenChange}
            />
          </div>
          <div 
            style={{ marginLeft: getMarginLeft()}}
            className={`flex-1 overflow-hidden mr-4 ${isMobileView ? 'mr-0.5' : 'mr-6'} transition-all duration-300 ease-in-out -z-0`}
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