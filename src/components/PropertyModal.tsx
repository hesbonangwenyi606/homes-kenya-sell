// import React, { useState } from 'react';
// import { X, MapPin, Bed, Bath, Square, Heart, Phone, MessageCircle } from 'lucide-react';
// import { Property } from './PropertyCard';

// interface PropertyModalProps {
//   property: Property;
//   onClose: () => void;
//   onFavorite: (property: Property) => Promise<void> | void;
//   isFavorite: boolean;
//   isLoggedIn: boolean;
//   onSubmitInquiry: (formData: { name: string; email: string; phone: string; message: string }) => Promise<void>;
// }

// const PropertyModal: React.FC<PropertyModalProps> = ({
//   property,
//   onClose,
//   onFavorite,
//   isFavorite,
//   isLoggedIn,
//   onSubmitInquiry,
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     message: `I am interested in "${property.title}" in ${property.location}.`,
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const formatPrice = (price: number) =>
//     new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(price);

//   const handleSubmitInquiry = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       await onSubmitInquiry(formData);
//       setFormData((prev) => ({
//         ...prev,
//         phone: '',
//         message: `I am interested in "${property.title}" in ${property.location}.`,
//       }));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
//         <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
//           {/* Image */}
//           <div className="lg:w-3/5 relative bg-gray-100">
//             <img src={property.image} alt={property.title} className="w-full h-64 lg:h-full object-cover" />
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
//             >
//               <X className="w-5 h-5 text-gray-700" />
//             </button>
//             <button
//               onClick={() => onFavorite(property)}
//               className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
//                 isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
//               }`}
//               aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//             >
//               <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
//             </button>
//           </div>

//           {/* Details */}
//           <div className="lg:w-2/5 overflow-y-auto p-6 lg:p-8">
//             <p className="text-3xl font-bold text-emerald-600 mb-2">{formatPrice(property.price)}</p>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
//             <div className="flex items-center text-gray-500 mb-6">
//               <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
//               <span>{property.location}</span>
//             </div>

//             {property.type !== 'land' && (
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <div className="bg-gray-50 rounded-xl p-4 text-center">
//                   <Bed className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
//                   <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
//                   <p className="text-sm text-gray-500">Bedrooms</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4 text-center">
//                   <Bath className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
//                   <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
//                   <p className="text-sm text-gray-500">Bathrooms</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4 text-center">
//                   <Square className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
//                   <p className="text-2xl font-bold text-gray-900">{property.sqft.toLocaleString()}</p>
//                   <p className="text-sm text-gray-500">Sq Ft</p>
//                 </div>
//               </div>
//             )}

//             {property.type === 'land' && (
//               <div className="bg-gray-50 rounded-xl p-4 mb-6">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Plot Size</span>
//                   <span className="text-xl font-bold text-gray-900">{property.sqft.toLocaleString()} sq ft</span>
//                 </div>
//               </div>
//             )}

//             {/* Property Description */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
//               <p className="text-gray-600 leading-relaxed">
//                 Beautiful {property.type} located in the heart of {property.location}. This property offers modern amenities, excellent security, and is close to schools, shopping centers, and major transport links. Perfect for families looking for a comfortable home in a prime location.
//               </p>
//             </div>

//             {/* Direct Contact Buttons */}
//             <div className="flex gap-2 mt-4">
//               <a
//                 href="tel:0725604549"
//                 className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
//               >
//                 <Phone className="w-5 h-5 text-emerald-600" /> Call
//               </a>
//               <a
//                 href="https://wa.me/254725604549"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
//               >
//                 <MessageCircle className="w-5 h-5" /> WhatsApp
//               </a>
//             </div>

//             {/* Inquiry Form */}
//             <div className="mt-6 border-t pt-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">Send Inquiry</h3>
//               {!isLoggedIn && (
//                 <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
//                   You can submit as guest, but sign in to track inquiry status in "My Inquiries".
//                 </p>
//               )}
//               <form onSubmit={handleSubmitInquiry} className="space-y-3">
//                 <input
//                   type="text"
//                   placeholder="Your name"
//                   value={formData.name}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                   className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   required
//                 />
//                 <input
//                   type="email"
//                   placeholder="Your email"
//                   value={formData.email}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
//                   className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   required
//                 />
//                 <input
//                   type="tel"
//                   placeholder="Phone number (optional)"
//                   value={formData.phone}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
//                   className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//                 <textarea
//                   rows={3}
//                   value={formData.message}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
//                   className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyModal;


















import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Heart, Phone, MessageCircle } from 'lucide-react';
import { Property } from './PropertyCard';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
  onFavorite: (property: Property) => Promise<void> | void;
  isFavorite: boolean;
  isLoggedIn: boolean;
  onSubmitInquiry: (formData: { name: string; email: string; phone: string; message: string }) => Promise<void>;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  onFavorite,
  isFavorite,
  isLoggedIn,
  onSubmitInquiry,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in "${property.title}" in ${property.location}.`,
  });
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(price);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitInquiry(formData);
      setFormData((prev) => ({
        ...prev,
        phone: '',
        message: `I am interested in "${property.title}" in ${property.location}.`,
      }));
    } finally {
      setSubmitting(false);
    }
  };

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
            <button
              onClick={() => onFavorite(property)}
              className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
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
                  <p className="text-2xl font-bold text-gray-900">{property.landSize ?? '—'}</p>
                  <p className="text-sm text-gray-500">Hectares</p>
                </div>
              </div>
            )}

            {property.type === 'land' && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plot Size</span>
                  <span className="text-xl font-bold text-gray-900">{property.landSize ?? '—'} ha</span>
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
              
                href="tel:0725604549"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-emerald-600" /> Call
              </a>
              
                href="https://wa.me/254725604549"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            </div>

            {/* Inquiry Form */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Send Inquiry</h3>
              {!isLoggedIn && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                  You can submit as guest, but sign in to track inquiry status in "My Inquiries".
                </p>
              )}
              <form onSubmit={handleSubmitInquiry} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;