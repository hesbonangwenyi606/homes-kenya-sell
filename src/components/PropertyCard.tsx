import React from 'react';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';

export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'apartment' | 'land' | 'bungalow';
  image: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
  onFavorite: () => void;
  isFavorite: boolean;
  onClick: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onFavorite, isFavorite, onClick }) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`;
    }
    return `KES ${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group w-full sm:w-80"
      onClick={() => onClick(property)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
            property.type === 'house' ? 'bg-emerald-500 text-white' :
            property.type === 'apartment' ? 'bg-blue-500 text-white' :
            property.type === 'land' ? 'bg-amber-500 text-white' :
            'bg-rose-500 text-white'
          }`}>
            {property.type}
          </span>
        </div>
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-12 sm:top-4 sm:right-14">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              Featured
            </span>
          </div>
        )}
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
          <p className="text-white text-lg sm:text-2xl font-bold">{formatPrice(property.price)}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-5">
        <h3 className="text-md sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 line-clamp-2">{property.title}</h3>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-2">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-emerald-600" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Property Details */}
        {property.type !== 'land' ? (
          <div className="flex flex-wrap items-center justify-between text-gray-600 dark:text-gray-300 border-t pt-2 sm:pt-4 text-sm sm:text-base gap-2">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> {property.bedrooms} Beds
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> {property.bathrooms} Baths
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> {property.sqft.toLocaleString()} sqft
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-600 dark:text-gray-300 border-t pt-2 sm:pt-4 text-sm sm:text-base gap-1">
            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> {property.sqft.toLocaleString()} sqft plot
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
