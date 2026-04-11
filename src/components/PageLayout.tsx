import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';
import FavoritesModal from './FavoritesModal';
import InquiriesModal from './InquiriesModal';
import { useAuth } from '@/hooks/useAuth';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { usePropertyInquiries } from '@/hooks/usePropertyInquiries';
import { useToast } from '@/hooks/use-toast';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { savedProperties, unsaveProperty } = useSavedProperties(user?.id);
  const { inquiries, loading: inquiriesLoading } = usePropertyInquiries(user?.id);

  const [showAuth, setShowAuth] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInquiries, setShowInquiries] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully.' });
  };

  const handleRemoveFavorite = async (propertyId: number) => {
    await unsaveProperty(propertyId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16 sm:pt-20">
      <Header
        favoritesCount={savedProperties.length}
        onShowFavorites={() => setShowFavorites(true)}
        onShowAuth={() => setShowAuth(true)}
        onShowInquiries={() => setShowInquiries(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      <main>{children}</main>

      <Footer />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showFavorites && (
        <FavoritesModal
          favorites={savedProperties}
          loading={false}
          onClose={() => setShowFavorites(false)}
          onRemove={handleRemoveFavorite}
          onViewProperty={() => setShowFavorites(false)}
          isLoggedIn={!!user}
          onShowAuth={() => { setShowFavorites(false); setShowAuth(true); }}
        />
      )}
      {showInquiries && (
        <InquiriesModal
          inquiries={inquiries}
          loading={inquiriesLoading}
          isLoggedIn={!!user}
          onClose={() => setShowInquiries(false)}
          onShowAuth={() => { setShowInquiries(false); setShowAuth(true); }}
        />
      )}
    </div>
  );
};

export default PageLayout;
