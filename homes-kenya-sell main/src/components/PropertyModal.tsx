import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, MessageCircle, Calendar, Car, Trees, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Property } from './PropertyCard';

interface PropertyModalProps {
  property: Property & { phoneNumbers: string[] }; // Added phoneNumbers here
  onClose: () => void;
  onFavorite: (property: Property) => void;
  isFavorite: boolean;
  onSubmitInquiry: (formData: { name: string; email: string; phone: string; message: string }) => Promise<{ error: any }>;
  isLoggedIn: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ 
  property, 
  onClose, 
  onFavorite, 
  isFavorite, 
  onSubmitInquiry,
  isLoggedIn 
}) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { error } = await onSubmitInquiry(contactForm);
      if (error) throw error;
      
      setFormSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    { icon: Car, label: 'Parking', value: '2 Spaces' },
    { icon: Trees, label: 'Garden', value: 'Yes' },
    { icon: Shield, label: 'Security', value: '24/7' },
    { icon: Calendar, label: 'Year Built', value: '2023' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image Gallery */}
          <div className="lg:w-3/5 relative bg-gray-100">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-64 lg:h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => onFavorite(property)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shadow-lg">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${
                property.type === 'house' ? 'bg-emerald-500 text-white' :
                property.type === 'apartment' ? 'bg-blue-500 text-white' :
                property.type === 'land' ? 'bg-amber-500 text-white' :
                'bg-rose-500 text-white'
              }`}>
                {property.type}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-2/5 overflow-y-auto">
            <div className="p-6 lg:p-8">
              <div className="mb-6">
                <p className="text-3xl font-bold text-emerald-600 mb-2">{formatPrice(property.price)}</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                  <span>{property.location}</span>
                </div>
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

              {property.type !== 'land' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div key={feature.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <feature.icon className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-sm text-gray-500">{feature.label}</p>
                          <p className="font-medium text-gray-900">{feature.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  Beautiful {property.type} located in the heart of {property.location}. This property offers modern amenities, 
                  excellent security, and is close to schools, shopping centers, and major transport links. 
                  Perfect for families looking for a comfortable home in a prime location.
                </p>
              </div>

              {/* Contact Form */}
              <div className="bg-emerald-50 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested? Contact Us</h3>
                {formSubmitted ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-emerald-700 font-medium">Thank you! We'll contact you soon.</p>
                    {isLoggedIn && (
                      <p className="text-sm text-emerald-600 mt-2">
                        Your inquiry has been saved to your account.
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                      placeholder="Your Message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </form>
                )}

                {/* Dynamic Call & WhatsApp buttons */}
                <div className="flex flex-col gap-2 mt-4">
                  {property.phoneNumbers.map((num) => (
                    <div key={num} className="flex gap-2">
                      <a
                        href={`tel:${num}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium">Call {num}</span>
                      </a>
                      <a
                        href={`https://wa.me/254${num.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">WhatsApp {num}</span>
                      </a>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
