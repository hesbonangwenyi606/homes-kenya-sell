import React, { useState } from 'react';
import { Menu, X, Heart, User, ChevronDown, Home, Building, MapPin, LogOut, FileText } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
  onShowAuth: () => void;
  onShowInquiries: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  favoritesCount, 
  onShowFavorites, 
  onShowAuth, 
  onShowInquiries,
  user, 
  onSignOut 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const propertyTypes = [
    { name: 'Houses', icon: Home },
    { name: 'Apartments', icon: Building },
    { name: 'Land', icon: MapPin },
    { name: 'Bungalows', icon: Home },
  ];

  const locations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Nyeri'
  ];

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kenya<span className="text-emerald-600">Homes</span></h1>
                <p className="text-xs text-gray-500 -mt-1">Find Your Dream Home</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Home
            </a>
            
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('properties')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                Properties
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'properties' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                  {propertyTypes.map((type) => (
                    <a
                      key={type.name}
                      href="#properties"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <type.icon className="w-4 h-4" />
                      {type.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('locations')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                Locations
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'locations' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                  {locations.map((location) => (
                    <a
                      key={location}
                      href="#properties"
                      className="block px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      {location}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#agents" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Agents
            </a>
            <a href="#calculator" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Mortgage Calculator
            </a>
            <a href="#contact" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onShowFavorites}
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onShowFavorites();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Saved Properties
                        {favoritesCount > 0 && (
                          <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                            {favoritesCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onShowInquiries();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        My Inquiries
                      </button>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-fadeIn">
            <nav className="flex flex-col gap-2">
              <a href="#" className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium">
                Home
              </a>
              <a href="#properties" className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium">
                Properties
              </a>
              <a href="#agents" className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium">
                Agents
              </a>
              <a href="#calculator" className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium">
                Mortgage Calculator
              </a>
              <a href="#contact" className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium">
                Contact
              </a>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onShowFavorites();
                    }}
                    className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium text-left flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Saved Properties
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onShowInquiries();
                    }}
                    className="px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-medium text-left flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    My Inquiries
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onShowAuth();
                  }}
                  className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
