import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Briefcase, MapPin, Clock, CheckCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  active: boolean;
}

const typeLabel: Record<string, string> = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  'contract': 'Contract',
};

const typeColor: Record<string, string> = {
  'full-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'part-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'contract': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/pages/careers`)
      .then((r) => r.json())
      .then((d) => setJobs(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers at Hemaprin Homes</h1>
          <p className="text-xl text-gray-300">
            Join Kenya's fastest-growing real estate team. We're looking for passionate, driven people who want to make a difference.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">Why Work With Us?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Uncapped Earnings', desc: 'Commission-based incentives mean your income is only limited by your effort and ambition.' },
              { title: 'Growth Opportunities', desc: 'Fast-growing company with clear paths to senior roles in sales, management, and operations.' },
              { title: 'Supportive Culture', desc: 'A collaborative, client-first culture where every team member is valued and supported.' },
            ].map((perk) => (
              <div key={perk.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{perk.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Open Positions</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">We're currently hiring for the following roles.</p>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No open positions at the moment. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Briefcase className="w-3.5 h-3.5" /> {job.department}
                          </span>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeColor[job.type]}`}>
                            <Clock className="w-3 h-3" /> {typeLabel[job.type]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex-shrink-0"
                      >
                        {expanded === job.id ? (
                          <><ChevronUp className="w-4 h-4" /> Less</>
                        ) : (
                          <><ChevronDown className="w-4 h-4" /> View Role</>
                        )}
                      </button>
                    </div>
                  </div>

                  {expanded === job.id && (
                    <div className="border-t border-gray-100 dark:border-gray-700 p-6 space-y-5">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">About the Role</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{job.description}</p>
                      </div>
                      {job.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Requirements</h4>
                          <ul className="space-y-1.5">
                            {job.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <a
                        href={`mailto:hemaprinhomes@gmail.com?subject=Application: ${encodeURIComponent(job.title)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4" /> Apply for this Role
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Open Application */}
      <section className="py-16 px-4 bg-emerald-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Don't See Your Role?</h2>
        <p className="text-emerald-100 mb-8 max-w-lg mx-auto">
          We're always open to talented people. Send us your CV and we'll reach out when the right opportunity arises.
        </p>
        <a
          href="mailto:hemaprinhomes@gmail.com?subject=Open Application - Hemaprin Homes"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
        >
          <Mail className="w-4 h-4" /> Send Open Application
        </a>
      </section>
    </PageLayout>
  );
};

export default CareersPage;
