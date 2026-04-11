import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Shield, Users, TrendingUp, Award, Star, Home, MapPin, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Users, TrendingUp, Award, Star, Home, MapPin, CheckCircle,
};

interface AboutStat { id: string; value: string; label: string; order: number; }
interface AboutValue { id: string; icon_name: string; title: string; desc: string; order: number; }
interface AboutTeamMember { id: string; name: string; role: string; location: string; order: number; }

interface AboutData {
  story: string[];
  stats: AboutStat[];
  values: AboutValue[];
  team: AboutTeamMember[];
}

const FALLBACK: AboutData = {
  story: [
    'Hemaprin Homes was founded with a simple mission: make property buying, selling, and investment in Kenya simple, transparent, and trustworthy.',
    'With a portfolio of verified listings and a team of seasoned agents, we have helped hundreds of families and investors find the perfect property.',
    'Based at Arcade House, 1st Floor, Nairobi, we combine local market knowledge with modern technology to give you the best property search experience in Kenya.',
  ],
  stats: [
    { id: 's1', value: '500+', label: 'Properties Listed', order: 1 },
    { id: 's2', value: '900+', label: 'Happy Clients', order: 2 },
    { id: 's3', value: '47', label: 'Cities Covered', order: 3 },
    { id: 's4', value: '150+', label: 'Expert Agents', order: 4 },
  ],
  values: [
    { id: 'v1', icon_name: 'Shield', title: 'Integrity', desc: 'We operate with full transparency. Every listing is verified and every transaction is handled with honesty.', order: 1 },
    { id: 'v2', icon_name: 'Users', title: 'Client First', desc: 'Your property goals drive everything we do. We listen, advise, and deliver results that matter to you.', order: 2 },
    { id: 'v3', icon_name: 'TrendingUp', title: 'Market Expertise', desc: 'Years of experience across Nairobi, Kiambu, Thika, and beyond means we know the market inside out.', order: 3 },
    { id: 'v4', icon_name: 'Award', title: 'Quality Listings', desc: "We curate only the best properties — residential, commercial, and land — across Kenya's key growth corridors.", order: 4 },
  ],
  team: [
    { id: 't1', name: 'Henry Njenga', role: 'Founder & CEO', location: 'Nairobi', order: 1 },
    { id: 't2', name: 'Grace Wanjiru', role: 'Head of Sales', location: 'Kiambu', order: 2 },
    { id: 't3', name: 'Peter Mwangi', role: 'Property Valuer', location: 'Thika', order: 3 },
    { id: 't4', name: 'Alice Kamau', role: 'Client Relations', location: 'Nairobi', order: 4 },
  ],
};

const AboutPage: React.FC = () => {
  const [data, setData] = useState<AboutData>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/pages/about`)
      .then((r) => r.json())
      .then((d) => { if (d.data) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { story, stats, values, team } = data;

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Hemaprin Homes</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We are Kenya's trusted real estate partner — connecting buyers, sellers, and investors with verified
            properties across Nairobi, Kiambu, Thika, Limuru, and beyond.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />)}
              </div>
            ) : (
              story.map((para, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{para}</p>
              ))
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl p-6 text-center animate-pulse">
                  <div className="h-10 w-20 bg-emerald-200 dark:bg-emerald-800 rounded mx-auto mb-2" />
                  <div className="h-3 bg-emerald-200 dark:bg-emerald-800 rounded w-3/4 mx-auto" />
                </div>
              ))
            ) : (
              stats.map((stat) => (
                <div key={stat.id} className="bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-emerald-600 mb-1">{stat.value}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Core Values</h2>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-40 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val) => {
                const Icon = ICON_MAP[val.icon_name] ?? Shield;
                return (
                  <div key={val.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{val.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Meet the Team</h2>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-40 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-emerald-600 text-sm mt-0.5">{member.role}</p>
                  <p className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> {member.location}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
        <p className="text-emerald-100 mb-8 max-w-xl mx-auto">Browse thousands of verified listings or speak to one of our agents today.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/" className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors">
            Browse Properties
          </a>
          <a href="tel:+254725604549" className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Phone className="w-4 h-4" /> +254 725 604 549
          </a>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
