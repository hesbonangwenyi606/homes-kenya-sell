// Footer.jsx
import React from 'react';
import { Whatsapp, MapPin, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Westlands, Nairobi, Kenya</span>
            </div>

            <div className="flex items-center gap-2">
              <Whatsapp className="w-5 h-5 text-green-500 animate-bounce" />
              {/* Clickable WhatsApp */}
              <a
                href="https://wa.me/254725604549"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                +254 725604549
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <a href="mailto:info@kenyahomes.co.ke" className="hover:underline">
                info@kenyahomes.co.ke
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded flex items-center justify-center transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded flex items-center justify-center transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded flex items-center justify-center transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded flex items-center justify-center transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
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
    </footer>
  );
};

export default Footer;
