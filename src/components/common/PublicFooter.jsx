import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="py-16 px-4 sm:px-8 bg-[#18120E] text-[#AFA49C] border-t border-[#2C241F]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2C241F]">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-[#A4512D] text-white flex items-center justify-center font-serif font-bold text-sm">
              E
            </span>
            <span className="font-serif text-lg font-bold text-white tracking-wider">
              EXPO<span className="text-[#A4512D]">SPHERE</span>
            </span>
          </div>
          <p className="text-xs text-[#83746A] leading-relaxed">
            The premier platform for world-class exhibitions, booth space reservations, and attendee management.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Navigation</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-white transition">Home Page</Link></li>
            <li><Link to="/expos" className="hover:text-white transition">All Expos</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition">Exhibition Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Event Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Event Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/expos" className="hover:text-white transition">Technology & AI</Link></li>
            <li><Link to="/expos" className="hover:text-white transition">Fashion & Lifestyle</Link></li>
            <li><Link to="/expos" className="hover:text-white transition">Business & Finance</Link></li>
            <li><Link to="/expos" className="hover:text-white transition">Food & Hospitality</Link></li>
            <li><Link to="/expos" className="hover:text-white transition">Automotive & Hardware</Link></li>
          </ul>
        </div>

        {/* Contact details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Get in Touch</h4>
          <div className="space-y-3 text-xs text-[#83746A]">
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
              <span>Expo Center, Dubai, UAE & Karachi, PK</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
              <span>info@eventsphere.com</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#A4512D] flex-shrink-0" />
              <span>+971 4 123 4567</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B5A4E] gap-4">
        <p>© 2026 EventSphere Platform. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link to="/login" className="hover:text-[#AFA49C] transition">Admin Portal</Link>
          <Link to="/login" className="hover:text-[#AFA49C] transition">Exhibitor Portal</Link>
          <Link to="/login" className="hover:text-[#AFA49C] transition">Attendee Portal</Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
