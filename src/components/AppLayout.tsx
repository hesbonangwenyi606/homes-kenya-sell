import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Home,
  Building,
  TreePine,
  TrendingUp,
  Shield,
  Users,
  MessageCircle,
  Phone,
  Mail,
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PropertyCard, { Property } from './PropertyCard';
import PropertyModal from './PropertyModal';
import TestimonialCard from './TestimonialCard';
import ContactSection from './ContactSection';
import RevealOnScroll from './RevealOnScroll';
import AuthModal from './AuthModal';
import FavoritesModal from './FavoritesModal';
import InquiriesModal from './InquiriesModal';
import { properties, locations, priceRanges, bedroomOptions } from '@/data/properties';
import { testimonials } from '@/data/agents';
import { useAuth } from '@/hooks/useAuth';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { usePropertyInquiries } from '@/hooks/usePropertyInquiries';
import { useToast } from '@/hooks/use-toast';

const AppLayout: React.FC = () => {
  const ITEMS_PER_PAGE = 6;
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { savedProperties, loading: favoritesLoading, toggleSaveProperty, unsaveProperty, isPropertySaved } = useSavedProperties(user?.id);
  const { inquiries, loading: inquiriesLoading, submitInquiry } = usePropertyInquiries(user?.id);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Property Types
  const propertyTypes = [
    { id: 'all', label: 'All Types', icon: Home },
    { id: 'house', label: 'Houses', icon: Home },
    { id: 'apartment', label: 'Apartments', icon: Building },
    { id: 'bungalow', label: 'Bungalows', icon: Home },
    { id: 'land', label: 'Land', icon: TreePine },
  ];

  // Quick Stats
  const stats = [
    { label: 'Properties Listed', value: '500+' },
    { label: 'Happy Clients', value: '900+' },
    { label: 'Cities Covered', value: '47' },
    { label: 'Expert Agents', value: '150+' },
  ];

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(query) || p.location.toLowerCase().includes(query)
      );
    }

    if (selectedType !== 'all') {
      result = result.filter((p) => p.type === selectedType);
    }

    if (selectedLocation !== 'All Locations') {
      result = result.filter((p) => p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    const priceRange = priceRanges[selectedPriceRange];
    result = result.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    if (selectedBedrooms > 0) {
      result = result.filter((p) => p.bedrooms >= selectedBedrooms);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedType, selectedLocation, selectedPriceRange, selectedBedrooms, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedLocation, selectedPriceRange, selectedBedrooms, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Handlers
  const handleToggleFavorite = async (property: Property) => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to save properties.', variant: 'destructive' });
      setShowAuth(true);
      return;
    }
    const wasSaved = isPropertySaved(property.id);
    const { error } = await toggleSaveProperty(property);
    if (error) {
      toast({
        title: 'Unable to update favorites',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: wasSaved ? 'Removed from favorites' : 'Added to favorites',
      description: wasSaved ? 'Property removed successfully.' : 'Property saved successfully.',
    });
  };

  const handleRemoveFavorite = async (propertyId: number) => {
    const { error } = await unsaveProperty(propertyId);
    if (error) {
      toast({
        title: 'Unable to remove favorite',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Removed from favorites',
      description: 'Property removed successfully.',
    });
  };

  const handleViewFavoriteProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowFavorites(false);
  };

  const handleSubmitInquiry = async (formData: { name: string; email: string; phone: string; message: string }) => {
    if (!selectedProperty) return;
    const { error } = await submitInquiry(selectedProperty, formData);
    if (error) {
      toast({
        title: 'Unable to submit inquiry',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Inquiry submitted',
      description: user ? 'You can track this in My Inquiries.' : 'Sign in to track inquiry status in your account.',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden pt-16 sm:pt-20">
      {/* Header */}
      <Header
        favoritesCount={savedProperties.length}
        onShowFavorites={() => setShowFavorites(true)}
        onShowAuth={() => setShowAuth(true)}
        onShowInquiries={() => setShowInquiries(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section id="home" className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572279611_caa18220.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Dream <span className="text-emerald-400">Home in Kenya</span>
            </h1>
            <p className="text-xl mb-6">
              Discover thousands of verified properties across Kenya. From luxury villas in Karen to beachfront homes in Mombasa.
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
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-4 rounded-xl bg-gray-50 text-gray-900 cursor-pointer"
                >
                  <option value="All Locations">All Locations</option>
                  {locations.map((loc) => (
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

      <RevealOnScroll>
        {/* Property Types */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4">
            {propertyTypes.map((type) => (
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
      </RevealOnScroll>

      <RevealOnScroll delayMs={80}>
        {/* Properties Grid */}
        <section id="properties" className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {filteredProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onFavorite={() => handleToggleFavorite(property)}
                      isFavorite={isPropertySaved(property.id)}
                      onClick={setSelectedProperty}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg border ${
                            currentPage === page
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No properties found. Adjust your filters.</p>
              </div>
            )}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={120}>
        {/* Testimonials */}
        <section className="py-16 bg-emerald-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Clients Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={160}>
        <ContactSection
          userId={user?.id}
          defaultName={user?.user_metadata?.full_name || ''}
          defaultEmail={user?.email || ''}
        />
      </RevealOnScroll>

      <Footer />

      {/* Modals */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onFavorite={handleToggleFavorite}
          isFavorite={isPropertySaved(selectedProperty.id)}
          onSubmitInquiry={handleSubmitInquiry}
          isLoggedIn={!!user}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showFavorites && (
        <FavoritesModal
          favorites={savedProperties}
          loading={favoritesLoading}
          onClose={() => setShowFavorites(false)}
          onRemove={handleRemoveFavorite}
          onViewProperty={handleViewFavoriteProperty}
          isLoggedIn={!!user}
          onShowAuth={() => setShowAuth(true)}
        />
      )}
      {showInquiries && (
        <InquiriesModal
          inquiries={inquiries}
          loading={inquiriesLoading}
          isLoggedIn={!!user}
          onClose={() => setShowInquiries(false)}
          onShowAuth={() => setShowAuth(true)}
        />
      )}
    </div>
  );
};

export default AppLayout;
