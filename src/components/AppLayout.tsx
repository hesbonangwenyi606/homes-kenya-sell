import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, Home, Building, TreePine, TrendingUp, Shield, Users, Phone, Mail, MessageCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import PropertyCard, { Property } from './PropertyCard';
import PropertyModal from './PropertyModal';
import AgentCard from './AgentCard';
import MortgageCalculator from './MortgageCalculator';
import TestimonialCard from './TestimonialCard';
import AuthModal from './AuthModal';
import FavoritesModal from './FavoritesModal';
import InquiriesModal from './InquiriesModal';
import { properties, locations, priceRanges, bedroomOptions } from '@/data/properties';
import { agents, testimonials } from '@/data/agents';
import { useAuth } from '@/hooks/useAuth';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { usePropertyInquiries } from '@/hooks/usePropertyInquiries';
import { useToast } from '@/hooks/use-toast';

const AppLayout: React.FC = () => {
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    savedProperties, 
    loading: savedLoading, 
    isPropertySaved, 
    toggleSaveProperty 
  } = useSavedProperties(user?.id);
  const { 
    inquiries, 
    loading: inquiriesLoading, 
    submitInquiry 
  } = usePropertyInquiries(user?.id);

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Filter properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((p) => p.type === selectedType);
    }

    // Location filter
    if (selectedLocation !== 'All Locations') {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Price filter
    const priceRange = priceRanges[selectedPriceRange];
    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Bedrooms filter
    if (selectedBedrooms > 0) {
      result = result.filter((p) => p.bedrooms >= selectedBedrooms);
    }

    // Sorting
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

  const handleToggleFavorite = async (property: Property) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties to your favorites.",
        variant: "destructive",
      });
      setShowAuth(true);
      return;
    }

    const { error } = await toggleSaveProperty(property);
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites.",
        variant: "destructive",
      });
    } else {
      const isSaved = isPropertySaved(property.id);
      toast({
        title: isSaved ? "Removed from favorites" : "Added to favorites",
        description: isSaved 
          ? `${property.title} has been removed from your saved properties.`
          : `${property.title} has been saved to your favorites.`,
      });
    }
  };

  const handleSubmitInquiry = async (formData: { name: string; email: string; phone: string; message: string }) => {
    if (!selectedProperty) return { error: { message: 'No property selected' } };
    
    const { error } = await submitInquiry(selectedProperty, formData);
    if (!error) {
      toast({
        title: "Inquiry sent!",
        description: "We'll get back to you as soon as possible.",
      });
    }
    return { error };
  };

  const handleAgentContact = (agent: any, method: 'phone' | 'email' | 'whatsapp') => {
    if (method === 'phone') {
      window.open(`tel:${agent.phone}`, '_self');
    } else if (method === 'email') {
      window.open(`mailto:${agent.email}`, '_self');
    } else if (method === 'whatsapp') {
      window.open(`https://wa.me/${agent.phone.replace(/\s/g, '').replace('+', '')}`, '_blank');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const propertyTypes = [
    { id: 'all', label: 'All Types', icon: Home, count: properties.length },
    { id: 'house', label: 'Houses', icon: Home, count: properties.filter(p => p.type === 'house').length },
    { id: 'apartment', label: 'Apartments', icon: Building, count: properties.filter(p => p.type === 'apartment').length },
    { id: 'bungalow', label: 'Bungalows', icon: Home, count: properties.filter(p => p.type === 'bungalow').length },
    { id: 'land', label: 'Land', icon: TreePine, count: properties.filter(p => p.type === 'land').length },
  ];

  const stats = [
    { label: 'Properties Listed', value: '2,500+' },
    { label: 'Happy Clients', value: '1,200+' },
    { label: 'Cities Covered', value: '47' },
    { label: 'Expert Agents', value: '150+' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        favoritesCount={savedProperties.length}
        onShowFavorites={() => setShowFavorites(true)}
        onShowAuth={() => setShowAuth(true)}
        onShowInquiries={() => setShowInquiries(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/696a4515213e3de2b9094c7d_1768572279611_caa18220.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-full text-sm font-medium mb-6">
              Kenya's Premier Real Estate Platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Dream <br />
              <span className="text-emerald-400">Home in Kenya</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Discover thousands of verified properties across Kenya. From luxury villas in Karen to beachfront homes in Mombasa.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-4 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <button
                  onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-300 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
                  selectedType === type.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="font-medium">{type.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedType === type.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {type.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {selectedType === 'all' ? 'Featured Properties' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s for Sale`}
              </h2>
              <p className="text-gray-600">
                {filteredProperties.length} properties found
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {priceRanges.map((range, idx) => (
                      <option key={idx} value={idx}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={selectedBedrooms}
                    onChange={(e) => setSelectedBedrooms(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {bedroomOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setSelectedLocation('All Locations');
                      setSelectedPriceRange(0);
                      setSelectedBedrooms(0);
                    }}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Property Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={() => handleToggleFavorite(property)}
                  isFavorite={isPropertySaved(property.id)}
                  onClick={setSelectedProperty}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedLocation('All Locations');
                  setSelectedPriceRange(0);
                  setSelectedBedrooms(0);
                }}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose KenyaHomes?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to making your property journey seamless and successful
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Verified Listings', desc: 'All properties are verified by our team for authenticity and accuracy' },
              { icon: Users, title: 'Expert Agents', desc: 'Work with experienced professionals who know the Kenyan market' },
              { icon: TrendingUp, title: 'Market Insights', desc: 'Get real-time data and trends to make informed decisions' },
              { icon: MessageCircle, title: '24/7 Support', desc: 'Our team is always available to assist you via phone or WhatsApp' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl hover:bg-emerald-50 transition-colors group">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 transition-colors">
                  <feature.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section id="calculator" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Plan Your Investment
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use our mortgage calculator to estimate your monthly payments and plan your budget
            </p>
          </div>
          <MortgageCalculator />
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Agents
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of experienced professionals is ready to help you find your perfect property
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onContact={handleAgentContact}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-900 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-emerald-200 max-w-2xl mx-auto">
              Hear from homeowners who found their dream properties through KenyaHomes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Contact us today and let our experts guide you through your property journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254700123456"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </a>
            <a
              href="https://wa.me/254700123456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a
              href="mailto:info@kenyahomes.co.ke"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>

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

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={() => {
            toast({
              title: "Welcome!",
              description: "You are now signed in.",
            });
          }}
        />
      )}

      {showFavorites && (
        <FavoritesModal
          favorites={savedProperties}
          loading={savedLoading}
          onClose={() => setShowFavorites(false)}
          onRemove={(propertyId) => {
            const property = properties.find(p => p.id === propertyId);
            if (property) handleToggleFavorite(property);
          }}
          onViewProperty={(property) => {
            setSelectedProperty(property);
            setShowFavorites(false);
          }}
          isLoggedIn={!!user}
          onShowAuth={() => {
            setShowFavorites(false);
            setShowAuth(true);
          }}
        />
      )}

      {showInquiries && (
        <InquiriesModal
          inquiries={inquiries}
          loading={inquiriesLoading}
          onClose={() => setShowInquiries(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
