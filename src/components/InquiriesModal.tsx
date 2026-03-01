import React from 'react';
import { X, FileText, MapPin, Clock, MessageSquare } from 'lucide-react';
import { PropertyInquiry } from '@/hooks/usePropertyInquiries';

interface InquiriesModalProps {
  inquiries: PropertyInquiry[];
  loading: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onShowAuth: () => void;
}

const statusStyles: Record<PropertyInquiry['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-100 text-slate-700',
};

const InquiriesModal: React.FC<InquiriesModalProps> = ({
  inquiries,
  loading,
  isLoggedIn,
  onClose,
  onShowAuth,
}) => {
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg sm:max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">My Inquiries</h2>
              <p className="text-sm text-blue-100">{inquiries.length} total inquiries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {!isLoggedIn ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view inquiries</h3>
              <p className="text-gray-500 mb-6">Track all your submitted property inquiries in one place.</p>
              <button
                onClick={() => {
                  onClose();
                  onShowAuth();
                }}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Sign In / Sign Up
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin w-8 h-8 text-indigo-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-500">Open a property and submit your first inquiry.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 sm:p-5 rounded-2xl border border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{inquiry.property_title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 flex flex-wrap gap-4 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {inquiry.property_location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      {formatDate(inquiry.created_at)}
                    </span>
                  </div>

                  {inquiry.message && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-gray-200 text-sm text-gray-700">
                      <p className="font-medium mb-1 inline-flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        Your Message
                      </p>
                      <p>{inquiry.message}</p>
                    </div>
                  )}
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
