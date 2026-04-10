import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-[88px]"> {/* Offset for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
