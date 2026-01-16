import React, { useState } from 'react';
import { Home, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send, ArrowRight } from 'lucide-react';

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
  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
  const quickLinks = ['About Us', 'Our Agents', 'Blog', 'Careers', 'FAQs', 'Contact'];
  const resources = ['Mortgage Calculator', 'Property Guide', 'Market Insights', 'Legal Guide', 'Investment Tips', 'Moving Checklist'];

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
                  placeholder="Enter your email"
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">

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
                <span>Westlands, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-emerald-500" />
                <a href="tel:+254725604549" className="hover:text-emerald-400 transition-colors">
                  +254 725604549
                </a>
                <a
                  href="https://wa.me/254725604549"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-emerald-400 hover:text-emerald-200 transition-colors text-sm"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span>info@kenyahomes.co.ke</span>
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

        {/* Social Icons Truly Centered */}
        <div className="flex justify-center gap-4 mt-10">
          <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
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
