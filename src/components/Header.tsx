import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Heart,
  User,
  ChevronDown,
  Home,
  Building,
  MapPin,
  LogOut,
  FileText,
  Sun,
  Moon
} from 'lucide-react';
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
  const [darkMode, setDarkMode] = useState(true);

  // Persist Dark / Light Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  const propertyTypes = [
    { name: 'Houses', icon: Home },
    { name: 'Apartments', icon: Building },
    { name: 'Land', icon: MapPin },
    { name: 'Bungalows', icon: Home },
  ];

  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Nyeri'];

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName().split(' ');
    return name.length > 1
      ? name[0].charAt(0).toUpperCase() + name[1].charAt(0).toUpperCase()
      : name[0].charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Kenya<span className="text-emerald-600">Homes</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-300 -mt-1">Find Your Dream Home</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">

            <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
              Home
            </a>

            {/* Properties Dropdown */}
            <Dropdown title="Properties" items={propertyTypes} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} type="icon" />

            {/* Locations Dropdown */}
            <Dropdown title="Locations" items={locations} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} />

            <a href="#agents" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
              Agents
            </a>
            <a href="#calculator" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
              Mortgage Calculator
            </a>
            <a href="#contact" className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Favorites */}
            <button onClick={onShowFavorites} className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Heart className="w-6 h-6" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button onClick={toggleTheme} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-105 transition">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-slideDownFade">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 truncate">{user.email}</p>
                      </div>

                      <UserMenuButton icon={Heart} label="Saved Properties" onClick={() => { setShowUserMenu(false); onShowFavorites(); }} badge={favoritesCount} />
                      <UserMenuButton icon={FileText} label="My Inquiries" onClick={() => { setShowUserMenu(false); onShowInquiries(); }} />
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <UserMenuButton icon={LogOut} label="Sign Out" onClick={() => { setShowUserMenu(false); onSignOut(); }} textColor="text-red-600" hoverColor="hover:bg-red-50" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={onShowAuth} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <MobileMenu
            propertyTypes={propertyTypes}
            locations={locations}
            user={user}
            favoritesCount={favoritesCount}
            onShowFavorites={onShowFavorites}
            onShowInquiries={onShowInquiries}
            onShowAuth={onShowAuth}
            onSignOut={onSignOut}
            closeMenu={() => setMobileMenuOpen(false)}
          />
        )}

      </div>
    </header>
  );
};

// ------------------- Dropdown Component -------------------
interface DropdownProps {
  title: string;
  items: any[];
  activeDropdown: string | null;
  setActiveDropdown: (val: string | null) => void;
  type?: 'icon';
}

const Dropdown: React.FC<DropdownProps> = ({ title, items, activeDropdown, setActiveDropdown, type }) => {
  return (
    <div className="relative" onMouseEnter={() => setActiveDropdown(title)} onMouseLeave={() => setActiveDropdown(null)}>
      <button className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors" aria-haspopup="true">
        {title} <ChevronDown className="w-4 h-4" />
      </button>
      {activeDropdown === title && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-slideDownFade">
          {items.map((item) => {
            const Icon = type === 'icon' ? item.icon : null;
            return (
              <a
                key={item.name ?? item}
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.name ?? item}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ------------------- User Menu Button -------------------
interface UserMenuButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  badge?: number;
  textColor?: string;
  hoverColor?: string;
}

const UserMenuButton: React.FC<UserMenuButtonProps> = ({ icon: Icon, label, onClick, badge, textColor = 'text-gray-700 dark:text-gray-200', hoverColor = 'hover:bg-emerald-50 dark:hover:bg-emerald-900' }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 ${textColor} ${hoverColor} transition-colors`}>
    <Icon className="w-4 h-4" />
    {label}
    {badge ? <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">{badge}</span> : null}
  </button>
);

// ------------------- Mobile Menu Component -------------------
interface MobileMenuProps {
  propertyTypes: any[];
  locations: string[];
  user: SupabaseUser | null;
  favoritesCount: number;
  onShowFavorites: () => void;
  onShowInquiries: () => void;
  onShowAuth: () => void;
  onSignOut: () => void;
  closeMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ propertyTypes, locations, user, favoritesCount, onShowFavorites, onShowInquiries, onShowAuth, onSignOut, closeMenu }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  return (
    <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-4 animate-slideDownFade">
      <nav className="flex flex-col gap-2">
        <a href="#" onClick={closeMenu} className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium">Home</a>
        
        {/* Accordion Properties */}
        <Accordion title="Properties" items={propertyTypes} openSection={openSection} setOpenSection={setOpenSection} closeMenu={closeMenu} type="icon" />
        
        {/* Accordion Locations */}
        <Accordion title="Locations" items={locations} openSection={openSection} setOpenSection={setOpenSection} closeMenu={closeMenu} />
        
        <a href="#agents" onClick={closeMenu} className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium">Agents</a>
        <a href="#calculator" onClick={closeMenu} className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium">Mortgage Calculator</a>
        <a href="#contact" onClick={closeMenu} className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium">Contact</a>

        {user ? (
          <>
            <button onClick={() => { onShowFavorites(); closeMenu(); }} className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" /> Saved Properties
            </button>
            <button onClick={() => { onShowInquiries(); closeMenu(); }} className="px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> My Inquiries
            </button>
            <button onClick={() => { onSignOut(); closeMenu(); }} className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </>
        ) : (
          <button onClick={() => { onShowAuth(); closeMenu(); }} className="mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium">
            <User className="w-4 h-4" /> Sign In
          </button>
        )}
      </nav>
    </div>
  );
};

// ------------------- Mobile Accordion Component -------------------
interface AccordionProps {
  title: string;
  items: any[];
  openSection: string | null;
  setOpenSection: (val: string | null) => void;
  closeMenu: () => void;
  type?: 'icon';
}

const Accordion: React.FC<AccordionProps> = ({ title, items, openSection, setOpenSection, closeMenu, type }) => {
  const isOpen = openSection === title;
  return (
    <div className="flex flex-col">
      <button onClick={() => setOpenSection(isOpen ? null : title)} className="px-4 py-3 w-full text-left flex justify-between items-center text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg font-medium">
        {title} <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="flex flex-col pl-6">
          {items.map((item) => {
            const Icon = type === 'icon' ? item.icon : null;
            return (
              <a key={item.name ?? item} onClick={closeMenu} href="#" className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4" />} {item.name ?? item}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
