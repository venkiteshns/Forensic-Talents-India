import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { cn } from '../../utils/cn';

export default function HomeHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Education', path: '/education' },
    { name: 'Games', path: '/games' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled 
          ? "bg-primary/40 backdrop-blur-[12px] border-b border-white/5 py-3" 
          : "bg-transparent py-6 border-b border-transparent"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          {/* Apply brightness/invert to make it white if necessary, but leaving object-contain as requested */}
          <img 
            src="/assets/logo.webp" 
            alt="Forensic Talents India Logo" 
            className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative group text-[15px] font-medium transition-colors duration-300 text-secondary-light hover:text-accent"
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="home-header-active"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link 
            to="/contact" 
            className="hidden lg:flex items-center justify-center px-6 py-2.5 rounded-full border border-accent/40 text-secondary-light text-[15px] font-medium transition-all duration-300 hover:bg-accent/10 hover:border-accent hover:text-accent hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] relative overflow-hidden group"
          >
            <span className="relative z-10">Contact Us</span>
            <div className="absolute inset-0 bg-accent/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </Link>

          <button
            className="lg:hidden text-white p-2 hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-primary/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-lg font-medium transition-colors",
                  location.pathname === link.path ? "text-accent" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center px-6 py-3 rounded-xl border border-accent/40 bg-accent/5 text-white font-bold transition-all hover:bg-accent hover:text-primary"
            >
              Contact Us
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
