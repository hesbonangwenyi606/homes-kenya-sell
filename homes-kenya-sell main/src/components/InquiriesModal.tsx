import React from 'react';
import { X, FileText, MapPin, Clock, CheckCircle, Phone, Mail } from 'lucide-react';
import { PropertyInquiry } from '@/hooks/usePropertyInquiries';

interface InquiriesModalProps {
  inquiries: PropertyInquiry[];
  loading: boolean;
  onClose: () => void;
}

const InquiriesModal: React.FC<InquiriesModalProps> = ({ inquiries, loading, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'contacted':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Phone className="w-3 h-3" />
            Contacted
          </span>
        );
      case 'resolved':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">My Inquiries</h2>
                <p className="text-blue-100">{inquiries.length} inquiries made</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin w-8 h-8 text-emerald-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-500 mb-6">
                When you inquire about properties, they'll appear here.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{inquiry.property_title}</h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                        {inquiry.property_location}
                      </div>
                    </div>
                    {getStatusBadge(inquiry.status)}
                  </div>

                  {inquiry.message && (
                    <p className="text-sm text-gray-600 mb-3 bg-white p-3 rounded-lg border border-gray-200">
                      "{inquiry.message}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(inquiry.created_at)}
                      </span>
                      {inquiry.agent_name && (
                        <span className="text-emerald-600">
                          Agent: {inquiry.agent_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    <a
                      href="tel:+254725604549"
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      0725604549
                    </a>
                    <a
                      href="tel:+254786604549"
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      0786604549
                    </a>
                    <a
                      href={`mailto:info@kenyahomes.co.ke?subject=Follow up on ${inquiry.property_title}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiriesModal;
