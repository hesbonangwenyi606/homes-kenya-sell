import React, { useState } from 'react';
import { Home, MapPin, Phone, Mail, Facebook, Twitter, Send, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const propertyTypes = ['Houses', 'Apartments', 'Land', 'Bungalows', 'Commercial', 'Villas'];
  const locations = ['Nairobi', 'Juja', 'Kiambu', 'Ruiru', 'Thika', 'Limuru'];
  const quickLinks = ['About Us', 'Careers', 'Contact'];
  const resources = ['Mortgage Calculator', 'Property Guide', 'Market Insights', 'Legal Guide', 'Investment Tips', 'Moving Checklist'];
  const phoneNumbers = ['0725604549'];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Get New Listings in Your Inbox</h3>
              <p className="text-emerald-100">Subscribe to receive the latest properties and market insights.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hemaprinhomes@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Kenya<span className="text-emerald-400">Homes</span></h2>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Kenya's premier real estate platform. Find your dream home from thousands of verified listings across the country.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <a
                  href="https://www.google.com/maps/search/Arcade+House,+Murang’a+Road+%26+Moi+Avenue,+Nairobi,+Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Arcade House 1st Floor, Nairobi
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span>{phoneNumbers.join(' | ')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span>hemaprinhomes@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Property Types</h4>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type}>
                  <a href="#properties" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Locations</h4>
            <ul className="space-y-3">
              {locations.map((location) => (
                <li key={location}>
                  <a href="#properties" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Centered Social Icons Above Horizontal Line */}
      <div className="flex justify-center gap-4 py-6">
        <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
          <Facebook className="w-5 h-5" />
        </a>
        <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
          <Twitter className="w-5 h-5" />
        </a>
        <a
          href="https://wa.me/254725604549
"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
        >
          {/* WhatsApp Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48a11.912 11.912 0 0 0-16.92 0c-4.69 4.69-4.69 12.3 0 16.99a11.88 11.88 0 0 0 16.92 0 11.88 11.88 0 0 0 0-16.99Zm-9.53 15.24c-1.71 0-3.41-.46-4.87-1.33l-3.25.85.88-3.21a8.98 8.98 0 0 1-1.33-4.85c0-4.99 4.07-9.06 9.06-9.06 2.42 0 4.7.94 6.42 2.66a9.048 9.048 0 0 1 2.65 6.41c0 4.99-4.07 9.06-9.06 9.06Zm5.02-6.55-1.46.74c-.19.09-.42.05-.55-.1l-.8-.82a.497.497 0 0 0-.51-.12c-.71.27-1.47.42-2.26.42a4.55 4.55 0 0 1-2.53-.82c-.69-.45-1.23-1.11-1.56-1.87-.24-.53-.14-1.15.24-1.6l.85-1.04c.13-.16.1-.38-.07-.51l-1.15-.85c-.15-.11-.37-.1-.5.03-1.01.97-1.57 2.3-1.57 3.69 0 2.71 2.23 4.94 4.94 4.94 1.16 0 2.29-.38 3.2-1.08.13-.11.14-.32.03-.46l-1.06-1.56Z"/>
          </svg>
        </a>
      </div>

      {/* Bottom Bar with Horizontal Line Below Icons */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 KenyaHomes. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
