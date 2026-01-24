import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';
import MortgageCalculator from './MortgageCalculator';
import TestimonialCard from './TestimonialCard';
import FavoritesModal from './FavoritesModal';
import AuthModal from './AuthModal';
import InquiriesModal from './InquiriesModal';

import { properties } from '@/data/properties';
import { testimonials } from '@/data/agents';

import { User } from '@supabase/supabase-js';

interface AppLayoutProps {
  user: User | null;
  onSignOut: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user, onSignOut }) => {
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);

  const favoriteProperties = properties.filter(p => p.isFavorite);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <Header
        favoritesCount={favoriteProperties.length}
        onShowFavorites={() => setShowFavorites(true)}
        onShowAuth={() => setShowAuth(true)}
        onShowInquiries={() => setShowInquiries(true)}
        user={user}
        onSignOut={onSignOut}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Properties Section */}
        <section id="properties">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        </section>

        {/* Mortgage Calculator */}
        <section id="calculator" className="mt-16">
          <MortgageCalculator />
        </section>

        {/* Testimonials */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What Our Clients Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(testimonial => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {showFavorites && (
        <FavoritesModal onClose={() => setShowFavorites(false)} />
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}

      {showInquiries && (
        <InquiriesModal onClose={() => setShowInquiries(false)} />
      )}
    </div>
  );
};

export default AppLayout;
