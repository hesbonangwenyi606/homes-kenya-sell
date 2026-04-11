import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <PageLayout>
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏗️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            This page is coming soon. We're working on it and will have it ready for you shortly.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default ComingSoon;
