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
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      onClick={() => onClick(property)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
            property.type === 'house' ? 'bg-emerald-500 text-white' :
            property.type === 'apartment' ? 'bg-blue-500 text-white' :
            property.type === 'land' ? 'bg-amber-500 text-white' :
            'bg-rose-500 text-white'
          }`}>
            {property.type}
          </span>
        </div>
        {property.featured && (
          <div className="absolute top-4 right-14">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              Featured
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-2xl font-bold">{formatPrice(property.price)}</p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
          <span className="text-sm">{property.location}</span>
        </div>
        {property.type !== 'land' && (
          <div className="flex items-center justify-between text-gray-600 border-t pt-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        )}
        {property.type === 'land' && (
          <div className="flex items-center text-gray-600 border-t pt-4">
            <Square className="w-4 h-4 mr-1 text-gray-400" />
            <span className="text-sm">{property.sqft.toLocaleString()} sqft plot</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
