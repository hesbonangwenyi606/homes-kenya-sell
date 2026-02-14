import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">
            Kenya<span className="text-emerald-400">Homes</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-8">
            <li>
              <Link to="/" className="hover:text-emerald-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/properties" className="hover:text-emerald-400 transition-colors">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/locations" className="hover:text-emerald-400 transition-colors">
                Locations
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
