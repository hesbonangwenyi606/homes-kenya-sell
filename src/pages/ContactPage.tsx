import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import ContactSection from '@/components/ContactSection';
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowLeft } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-300">
            Whether you're buying, selling, or investing — our team is ready to help. Reach out and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: 'Our Office',
              lines: ['Arcade House, 1st Floor', 'Nairobi, Kenya'],
            },
            {
              icon: Phone,
              title: 'Call Us',
              lines: ['+254 725 604 549'],
              href: 'tel:+254725604549',
            },
            {
              icon: Mail,
              title: 'Email Us',
              lines: ['hemaprinhomes@gmail.com'],
              href: 'mailto:hemaprinhomes@gmail.com',
            },
            {
              icon: Clock,
              title: 'Working Hours',
              lines: ['Mon – Fri: 8am – 6pm', 'Sat: 9am – 4pm'],
            },
          ].map(({ icon: Icon, title, lines, href }) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              {href ? (
                <a href={href} className="text-gray-500 dark:text-gray-400 text-sm hover:text-emerald-600 transition-colors">
                  {lines.map((l, i) => <span key={i} className="block">{l}</span>)}
                </a>
              ) : (
                lines.map((l, i) => <p key={i} className="text-gray-500 dark:text-gray-400 text-sm">{l}</p>)
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <ContactSection />

      {/* WhatsApp CTA */}
      <section className="py-12 px-4 bg-emerald-600 text-white text-center">
        <p className="text-lg font-medium mb-4">Prefer a quick chat? Message us on WhatsApp</p>
        <a
          href="https://wa.me/254725604549"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
        </a>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
