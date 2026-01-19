import React from 'react';
import { X, Heart, MapPin, Bed, Bath, Square, Trash2 } from 'lucide-react';
import { Property } from './PropertyCard';
import { SavedProperty } from '@/hooks/useSavedProperties';

interface FavoritesModalProps {
  favorites: SavedProperty[];
  loading: boolean;
  onClose: () => void;
  onRemove: (propertyId: number) => void;
  onViewProperty: (property: Property) => void;
  isLoggedIn: boolean;
  onShowAuth: () => void;
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ 
  favorites, 
  loading,
  onClose, 
  onRemove, 
  onViewProperty,
  isLoggedIn,
  onShowAuth
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`;
    }
    return `KES ${(price / 1000).toFixed(0)}K`;
  };

  const convertToProperty = (saved: SavedProperty): Property => ({
    id: saved.property_id,
    title: saved.property_title,
    location: saved.property_location,
    price: saved.property_price,
    type: saved.property_type as Property['type'],
    image: saved.property_image,
    bedrooms: saved.property_bedrooms,
    bathrooms: saved.property_bathrooms,
    sqft: saved.property_sqft,
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">Saved Properties</h2>
              <p className="text-sm sm:text-red-100">{favorites.length} properties saved</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!isLoggedIn ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Sign in to save properties</h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                Create an account to save your favorite properties and access them from any device.
              </p>
              <button
                onClick={() => { onClose(); onShowAuth(); }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Sign In / Sign Up
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin w-8 h-8 text-emerald-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No saved properties</h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">Start browsing and save properties you love!</p>
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((saved) => {
                const property = convertToProperty(saved);
                return (
                  <div
                    key={saved.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full sm:w-32 h-40 sm:h-24 object-cover rounded-xl cursor-pointer"
                      onClick={() => onViewProperty(property)}
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className="font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-emerald-600"
                            onClick={() => onViewProperty(property)}
                          >
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                            {property.location}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(property.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <p className="text-lg font-bold text-emerald-600">{formatPrice(property.price)}</p>
                        {property.type !== 'land' && (
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              {property.bedrooms}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              {property.bathrooms}
                            </span>
                            <span className="flex items-center gap-1">
                              <Square className="w-4 h-4" />
                              {property.sqft.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
