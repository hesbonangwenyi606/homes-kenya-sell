import React, { useState } from 'react';
import { Home, Mail, Facebook, Twitter, Instagram, Linkedin, Send, Phone, MessageCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNewsletterSubscribers } from '@/hooks/useNewsletterSubscribers';
import { useToast } from '@/hooks/use-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { loading, subscribe } = useNewsletterSubscribers();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const { error } = await subscribe(email);
    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already subscribed',
          description: 'This email is already on our newsletter list.',
        });
      } else {
        toast({
          title: 'Subscription failed',
          description: error.message || 'Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    setSubscribed(true);
    setEmail('');
    toast({
      title: 'Subscribed successfully',
      description: 'You will now receive listings and market insights.',
    });
    setTimeout(() => setSubscribed(false), 3000);
  };

  const propertyTypes = [
    { label: 'Houses', path: '/?type=house' },
    { label: 'Apartments', path: '/?type=apartment' },
    { label: 'Land', path: '/?type=land' },
    { label: 'Bungalows', path: '/?type=bungalow' },
    { label: 'Commercial', path: '/' },
    { label: 'Villas', path: '/' },
  ];
  const locations = ['Nairobi', 'Juja', 'Kiambu', 'Ruiru', 'Thika', 'Limuru'];
  const quickLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Contact', path: '/contact' },
  ];

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
                disabled={loading}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {loading ? 'Submitting...' : subscribed ? 'Subscribed!' : 'Subscribe'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hemaparim<span className="text-emerald-400">Homes</span></h2>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Hemaparin Homes. Find your dream home from thousands of verified listings in our Quiver.
            </p>
            <div className="flex gap-4 mt-6">
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

          {/* Property Types */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Property Types</h4>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type.label}>
                  <Link to={type.path} className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {type.label}
                  </Link>
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
                  <Link to={`/?location=${location}`} className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {location}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, path }) => (
                <li key={label}>
                  <Link to={path} className="text-gray-400 hover:text-emerald-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info (Last Column) */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Arcade House, 1st Floor, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="tel:+254725604549" className="hover:text-emerald-400 transition-colors">+254 725 604 549</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="mailto:hemaprinhomes@gmail.com" className="hover:text-emerald-400 transition-colors">hemaprinhomes@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 KenyaHomes. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-gray-400 hover:text-emerald-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
