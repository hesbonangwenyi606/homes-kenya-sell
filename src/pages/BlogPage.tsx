import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { BookOpen, User, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  published: boolean;
  created_at: string;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/pages/blog`)
      .then((r) => r.json())
      .then((d) => setPosts(d.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

  const categoryColor: Record<string, string> = {
    'Market Insights': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    "Buyer's Guide": 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Investment Tips': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Real Estate Insights</h1>
          <p className="text-xl text-gray-300">
            Market trends, buyer guides, and investment tips from Kenya's real estate experts.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="h-52 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 py-16">No blog posts available yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-52 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColor[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        <Tag className="w-3 h-3 inline mr-1" />{post.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">{post.excerpt}</p>

                    {/* Expanded content */}
                    {expanded === post.id && (
                      <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                        {post.content.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(post.created_at)}</span>
                      </div>
                      <button
                        onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        {expanded === post.id ? (
                          <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                        ) : (
                          <><ChevronDown className="w-3.5 h-3.5" /> Read more</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BlogPage;
