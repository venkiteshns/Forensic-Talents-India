import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>);
const YoutubeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2 8.7 2 12 2 12s0 3.3.5 4.9c.3 1.1 1.2 2 2.3 2.1 2.2.2 7.2.2 7.2.2s5 0 7.2-.2c1.1-.1 2-1 2.3-2.1.5-1.6.5-4.9.5-4.9s0-3.3-.5-4.9c-.3-1.1-1.2-2-2.3-2.1-2.2-.2-7.2-.2-7.2-.2s-5 0-7.2.2c-1.1.1-2 1-2.3 2.1z" /><path d="M10 15l5-3-5-3v6z" /></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>);
const LinkedinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>);
const WhatsappIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-slate-300 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-6">
            <img src="/assets/logo.png" alt="Forensic Talents India" className="h-16 w-auto object-contain bg-white rounded-lg p-2" />
            <p className="text-sm leading-relaxed">
              Forensic Talents India offers premier medico-legal, cyber forensics, and psychological testing services. Reports valid under the Indian Evidence Act.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.youtube.com/@forensictalents4531" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="YouTube"><YoutubeIcon /></a>
              <a href="https://www.instagram.com/forensictalents/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Instagram"><InstagramIcon /></a>
              <a href="https://www.linkedin.com/in/forensic-talents-india-a54163179/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="LinkedIn"><LinkedinIcon /></a>
              <a href="https://x.com/4n6talentsIndia" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Twitter"><TwitterIcon /></a>
              <a href="https://www.facebook.com/forensictalents/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="Facebook"><FacebookIcon /></a>
              <a href="https://chat.whatsapp.com/DkIdN4xqkg5BwBjYVaXZoI" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" title="WhatsApp Group"><WhatsappIcon /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/education" className="hover:text-white transition-colors">Education & Training</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services/pcc" className="hover:text-white transition-colors">Police Clearance Certificate</Link></li>
              <li><Link to="/services/fingerprint" className="hover:text-white transition-colors">Fingerprint Examination</Link></li>
              <li><Link to="/services/cyber" className="hover:text-white transition-colors">Cyber Forensics</Link></li>
              <li><Link to="/services/questioned-documents" className="hover:text-white transition-colors">Questioned Documents</Link></li>
              <li><Link to="/services/crime-scene" className="hover:text-white transition-colors">Crime Scene Investigation</Link></li>
              <li><Link to="/services/cross-examination" className="hover:text-white transition-colors">Cross Examination</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <span>A-411, Supath-II Complex, Opp. Old Wadaj Bus Stop,
                  Old Wadaj, Ashram Road,
                  Ahmedabad – 380013, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <a href="tel:+917046669919" className="hover:text-white transition-colors">+91 70466 69919</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span>info@forensictalents.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-xs">
          <p>&copy; {currentYear} Forensic Talents India. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
