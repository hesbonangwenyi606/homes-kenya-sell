import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Send,
  ArrowRight
} from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const propertyTypes = ['Houses', 'Apartments', 'Land', 'Bungalows', 'Commercial', 'Villas'];
  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
  const quickLinks = ['About Us', 'Our Agents', 'Blog', 'Careers', 'FAQs', 'Contact'];
  const resources = [
    'Mortgage Calculator',
    'Property Guide',
    'Market Insights',
    'Legal Guide',
    'Investment Tips',
    'Moving Checklist'
  ];

  return (
    <footer className="bg-gray-900 text-white">

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold mb-2">Get New Listings in Your Inbox</h3>
              <p className="text-emerald-100">
                Subscribe to receive the latest properties and market insights.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold flex items-center gap-2"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
                {!subscribed && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Brand */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">
                Kenya<span className="text-emerald-400">Homes</span>
              </h2>
            </div>
            <p className="text-gray-400">
              Kenya's premier real estate platform with verified listings nationwide.
            </p>
          </div>

          {/* Lists */}
          {[
            ['Property Types', propertyTypes],
            ['Locations', locations],
            ['Quick Links', quickLinks],
            ['Resources', resources]
          ].map(([title, items]) => (
            <div key={title as string}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {(items as string[]).map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-emerald-400 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex gap-3">
                <MapPin className="text-emerald-500" /> Westlands, Nairobi
              </div>
              <div className="flex gap-3">
                <Phone className="text-emerald-500" />
                <a href="tel:+254725604549">+254 725 604 549</a>
              </div>
              <div className="flex gap-3">
                <Mail className="text-emerald-500" />
                <a href="mailto:info@kenyahomes.co.ke">
                  info@kenyahomes.co.ke
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Socials */}
        <div className="flex justify-center gap-4 mt-10">
          <SocialIcon icon={<Facebook />} />
          <SocialIcon icon={<Twitter />} />
          <SocialIcon icon={<Instagram />} />
          <SocialIcon icon={<Linkedin />} />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
        © 2026 KenyaHomes. All rights reserved.
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a
    href="#"
    className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
  >
    {icon}
  </a>
);

export default Footer;
