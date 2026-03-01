import React, { useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useContactLeads } from '@/hooks/useContactLeads';
import { useToast } from '@/hooks/use-toast';

interface ContactSectionProps {
  userId?: string;
  defaultName?: string;
  defaultEmail?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ userId, defaultName = '', defaultEmail = '' }) => {
  const { toast } = useToast();
  const { loading, submitLead } = useContactLeads(userId);
  const [formData, setFormData] = useState({
    fullName: defaultName,
    email: defaultEmail,
    phone: '',
    purpose: 'buy' as 'buy' | 'rent' | 'invest',
    preferredLocations: '',
    propertyType: '',
    budgetMin: '',
    budgetMax: '',
    bedrooms: '',
    timeline: '',
    preferredContactMethod: 'phone' as 'phone' | 'email' | 'whatsapp',
    message: '',
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast({
        title: 'Consent required',
        description: 'Please allow us to contact you about your request.',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await submitLead({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      purpose: formData.purpose,
      preferredLocations: formData.preferredLocations,
      propertyType: formData.propertyType,
      budgetMin: formData.budgetMin ? Number(formData.budgetMin) : null,
      budgetMax: formData.budgetMax ? Number(formData.budgetMax) : null,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      timeline: formData.timeline,
      preferredContactMethod: formData.preferredContactMethod,
      message: formData.message,
    });

    if (error) {
      toast({
        title: 'Unable to send request',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Request received',
      description: 'Our team will contact you shortly.',
    });

    setFormData((prev) => ({
      ...prev,
      phone: '',
      preferredLocations: '',
      propertyType: '',
      budgetMin: '',
      budgetMax: '',
      bedrooms: '',
      timeline: '',
      message: '',
      consent: false,
    }));
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <p className="text-emerald-300 text-sm uppercase tracking-[0.18em]">Get Expert Guidance</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Tell us what you need and we will match you to the right property options.
            </h2>
            <p className="text-slate-200">
              Share your goals, budget, and timeline. Our team uses this information to send relevant listings and arrange qualified follow-up.
            </p>

            <div className="space-y-3">
              <a href="tel:+254700123456" className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                <Phone className="w-5 h-5 text-emerald-300" />
                <span>+254 700 123 456</span>
              </a>
              <a href="mailto:info@kenyahomes.co.ke" className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                <Mail className="w-5 h-5 text-emerald-300" />
                <span>info@kenyahomes.co.ke</span>
              </a>
              <a
                href="https://wa.me/254725604549"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value as 'buy' | 'rent' | 'invest' }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="buy">Purpose: Buy</option>
                  <option value="rent">Purpose: Rent</option>
                  <option value="invest">Purpose: Invest</option>
                </select>
                <input
                  type="text"
                  placeholder="Preferred locations (e.g. Karen, Kilimani)"
                  value={formData.preferredLocations}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferredLocations: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Property type (house, apartment, land...)"
                  value={formData.propertyType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, propertyType: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Budget min (KES)"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budgetMin: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Budget max (KES)"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Timeline (e.g. next 30 days)"
                  value={formData.timeline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      preferredContactMethod: e.target.value as 'phone' | 'email' | 'whatsapp',
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="phone">Preferred contact: Phone</option>
                  <option value="email">Preferred contact: Email</option>
                  <option value="whatsapp">Preferred contact: WhatsApp</option>
                </select>
                <textarea
                  placeholder="Tell us more about what you need..."
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2"
                />
              </div>

              <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600"
                />
                <span>I agree to be contacted by KenyaHomes about my request and related property opportunities.</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting request...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
