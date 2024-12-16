'use client'

import { Outlet } from "@remix-run/react";
import Sidebar from "../components/layout/Sidebar";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import NoAuth from '../components/auth/noAuth'
import LoadingSpinner from '../components/helpers/loaderIcon'

async function getSession() {
  const {data, error} = await supabase.auth.getSession();
  if(error) {console.error(error)}
  return data
}

export default function DashboardIndexPage() {
  const [responsive, setResponsive] = useState(false)
  const [authState, setAuthState] = useState('loading');
  const [isMobileHidden, setIsMobileHidden] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 601px)');
    
    const handleViewportChange = (e) => {
      setResponsive(e.matches);
      setIsMobileView(e.matches);
    };

    handleViewportChange(mediaQuery);
    
    mediaQuery.addEventListener('change', handleViewportChange);

    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setAuthState(session.session !== null ? 'authenticated' : 'unauthenticated');
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setAuthState('authenticated');
      } else if (event === 'SIGNED_OUT') {
        setAuthState('unauthenticated');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const sidebarWidth = responsive ? (isMobileHidden ? 0 : 80 ) : 240;

  const handleMobileHiddenChange = (hidden) => {
    setIsMobileHidden(hidden);
  };

  const getMarginLeft = () => {
    if (isMobileView) {
      return isMobileHidden ? '24px' : '24px';
    }
  
    return responsive ? '100px' : `${sidebarWidth + 20}px`;
  };

  if (authState === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex font-inter">
      {authState === 'authenticated' ? (
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
            className={`flex-1 overflow-hidden ${isMobileView ? 'mr-6 mt-8' : 'mr-6'} transition-all duration-300 ease-in-out -z-0`}
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

