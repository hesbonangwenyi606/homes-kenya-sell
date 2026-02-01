import React, { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Home,
  Building,
  TreePine,
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PropertyCard, { Property } from './PropertyCard';
import PropertyModal from './PropertyModal';
import MortgageCalculator from './MortgageCalculator';
import TestimonialCard from './TestimonialCard';
import AuthModal from './AuthModal';
import FavoritesModal from './FavoritesModal';
import InquiriesModal from './InquiriesModal';
import { properties, locations, priceRanges } from '@/data/properties';
import { testimonials } from '@/data/agents';
import { useAuth } from '@/hooks/useAuth';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { usePropertyInquiries } from '@/hooks/usePropertyInquiries';
import { useToast } from '@/hooks/use-toast';

const AppLayout: React.FC = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { savedProperties, toggleSaveProperty, isPropertySaved } = useSavedProperties(user?.id);
  const { inquiries, submitInquiry } = usePropertyInquiries(user?.id);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Property Types
  const propertyTypes = [
    { id: 'all', label: 'All Types', icon: Home },
    { id: 'house', label: 'Houses', icon: Home },
    { id: 'apartment', label: 'Apartments', icon: Building },
    { id: 'bungalow', label: 'Bungalows', icon: Home },
    { id: 'land', label: 'Land', icon: TreePine },
  ];

  // Handlers
  const handleToggleFavorite = useCallback(
    async (property: Property) => {
      if (!user) {
        toast({ title: 'Sign in required', description: 'Please sign in to save properties.', variant: 'destructive' });
        setShowAuth(true);
        return;
      }
      try {
        await toggleSaveProperty(property);
      } catch {
        toast({ title: 'Error', description: 'Failed to update favorites.', variant: 'destructive' });
      }
    },
    [user, toggleSaveProperty, toast]
  );

  const handleClickProperty = useCallback((property: Property) => setSelectedProperty(property), []);
  const handleSubmitInquiry = useCallback(
    async (formData: { name: string; email: string; phone: string; message: string }) => {
      if (!selectedProperty) return;
      try {
        await submitInquiry(selectedProperty, formData);
        toast({ title: 'Inquiry submitted', description: 'We will get back to you soon!' });
      } catch {
        toast({ title: 'Error', description: 'Failed to submit inquiry.', variant: 'destructive' });
      }
    },
    [selectedProperty, submitInquiry, toast]
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
  }, [signOut, toast]);

  const handleShowFavorites = useCallback(() => setShowFavorites(true), []);
  const handleShowAuth = useCallback(() => setShowAuth(true), []);
  const handleShowInquiries = useCallback(() => setShowInquiries(true), []);

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties) || properties.length === 0) return [];

    let result = [...properties];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title?.toLowerCase().includes(query) || p.location?.toLowerCase().includes(query)
      );
    }

    if (selectedType !== 'all') result = result.filter((p) => p.type === selectedType);
    if (selectedLocation && selectedLocation !== 'All Locations') {
      result = result.filter((p) => p.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    const priceRange = priceRanges?.[selectedPriceRange] ?? { min: 0, max: Infinity };
    result = result.filter((p) => (typeof p.price === 'number' ? p.price : 0) >= priceRange.min &&
                                   (typeof p.price === 'number' ? p.price : 0) <= priceRange.max);

    if (selectedBedrooms > 0) result = result.filter((p) => (p.bedrooms ?? 0) >= selectedBedrooms);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return (a.price ?? 0) - (b.price ?? 0);
        case 'price-high': return (b.price ?? 0) - (a.price ?? 0);
        case 'newest': return (b.id ?? 0) - (a.id ?? 0);
        case 'featured':
        default: return (Number(b.featured) || 0) - (Number(a.featured) || 0);
      }
    });

    return result;
  }, [searchQuery, selectedType, selectedLocation, selectedPriceRange, selectedBedrooms, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        favoritesCount={savedProperties?.length ?? 0}
        onShowFavorites={handleShowFavorites}
        onShowAuth={handleShowAuth}
        onShowInquiries={handleShowInquiries}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section className="relative h-96 lg:h-[28rem] overflow-hidden bg-gray-300">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572279611_caa18220.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Dream <span className="text-emerald-400">Home in Kenya</span>
            </h1>
            <p className="text-lg md:text-xl mb-4">
              Discover thousands of verified properties across Kenya.
            </p>

            {/* Search */}
            <div className="bg-white rounded-2xl p-2 shadow-lg">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-4 rounded-xl bg-gray-50 cursor-pointer"
                >
                  <option value="All Locations">All Locations</option>
                  {(locations?.length > 0 ? locations : ['Nairobi', 'Mombasa']).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <button
                  onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4">
          {(propertyTypes?.length > 0 ? propertyTypes : [{ id: 'all', label: 'All Types', icon: Home }])
            .map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition ${
                  selectedType === type.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <type.icon className="w-5 h-5" />
                {type.label}
              </button>
          ))}
        </div>
      </section>

      {/* Properties Grid */}
      <section id="properties" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={() => handleToggleFavorite(property)}
                  isFavorite={isPropertySaved?.(property.id) ?? false}
                  onClick={() => handleClickProperty(property)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500">No properties found. Try adjusting your search or filters.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[1,2,3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(testimonials ?? []).map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
          </div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section id="calculator" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <MortgageCalculator />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onFavorite={handleToggleFavorite}
          isFavorite={isPropertySaved?.(selectedProperty.id) ?? false}
          onSubmitInquiry={handleSubmitInquiry}
          isLoggedIn={!!user}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showFavorites && <FavoritesModal favorites={savedProperties ?? []} onClose={() => setShowFavorites(false)} />}
      {showInquiries && <InquiriesModal inquiries={inquiries ?? []} onClose={() => setShowInquiries(false)} />}
    </div>
  );
};

export default AppLayout;
