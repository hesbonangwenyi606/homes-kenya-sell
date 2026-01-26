import React from 'react';
import { X, MapPin, Bed, Bath, Square, Heart, Share2, Phone, MessageCircle } from 'lucide-react';
import { Property } from './PropertyCard';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
  onFavorite: (property: Property) => void;
  isFavorite: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  onFavorite,
  isFavorite,
}) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image */}
          <div className="lg:w-3/5 relative bg-gray-100">
            <img src={property.image} alt={property.title} className="w-full h-64 lg:h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Details */}
          <div className="lg:w-2/5 overflow-y-auto p-6 lg:p-8">
            <p className="text-3xl font-bold text-emerald-600 mb-2">{formatPrice(property.price)}</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
            <div className="flex items-center text-gray-500 mb-6">
              <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
              <span>{property.location}</span>
            </div>

            {property.type !== 'land' && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Square className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-2xl font-bold text-gray-900">{property.sqft.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Sq Ft</p>
                </div>
              </div>
            )}

            {property.type === 'land' && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plot Size</span>
                  <span className="text-xl font-bold text-gray-900">{property.sqft.toLocaleString()} sq ft</span>
                </div>
              </div>
            )}

            {/* Property Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful {property.type} located in the heart of {property.location}. This property offers modern amenities, excellent security, and is close to schools, shopping centers, and major transport links. Perfect for families looking for a comfortable home in a prime location.
              </p>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex gap-2 mt-4">
              <a
                href="tel:0725604549"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-emerald-600" /> Call
              </a>
              <a
                href="https://wa.me/254725604549"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
