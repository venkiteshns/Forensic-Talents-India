import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Container } from '../ui/Container';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Education', path: '/education' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-white py-5"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Forensic Talents India Logo" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent-cyan",
                location.pathname === link.path ? "text-primary font-bold" : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="hidden xl:inline-flex">
            <Button variant="primary" size="sm">
              Book Consultation
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </Container>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-4 px-4 flex flex-col gap-4 fade-in">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-lg font-medium",
                location.pathname === link.path ? "text-primary font-bold" : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/contact" className="w-full mt-4 block" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="primary" className="w-full">
              Book Consultation
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
