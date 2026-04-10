import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

export function Layout() {
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
