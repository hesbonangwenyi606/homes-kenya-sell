import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { ChevronDown, HelpCircle, Phone, Mail, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const FAQsPage: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/pages/faqs`)
      .then((r) => r.json())
      .then((d) => setItems(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">
            Everything you need to know about buying, selling, and investing in property with Hemaprin Homes.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">No FAQs available yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(open === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform duration-200 ${open === item.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open === item.id && (
                    <div className="px-6 pb-5 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-4">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="py-16 px-4 bg-emerald-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
        <p className="text-emerald-100 mb-8 max-w-lg mx-auto">
          Our team is ready to help. Reach out directly and we'll get back to you within 24 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="tel:+254725604549"
            className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <Phone className="w-4 h-4" /> +254 725 604 549
          </a>
          <a
            href="mailto:hemaprinhomes@gmail.com"
            className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Mail className="w-4 h-4" /> Email Us
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default FAQsPage;
