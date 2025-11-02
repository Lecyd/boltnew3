import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Welcome from './views/Welcome';
import Home from './views/Home';
import Exhibitions from './views/Exhibitions';
import Gallery3D from './views/Gallery3D';
import AudioGuides from './views/AudioGuides';
import About from './views/About';
import Contact from './views/Contact';
import AdminLogin from './views/AdminLogin';
import AdminPanel from './views/AdminPanel';

type View = 'welcome' | 'home' | 'exhibitions' | 'gallery3d' | 'audioguides' | 'about' | 'contact' | 'admin' | 'admin-panel';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [collectionSlug, setCollectionSlug] = useState<string | undefined>();
  const [hasEntered, setHasEntered] = useState(false);
  const { isAuthenticated } = useAdmin();

  useEffect(() => {
    const entered = localStorage.getItem('museum-entered');
    if (entered === 'true') {
      setHasEntered(true);
      setCurrentView('home');
    }

    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentView('admin');
    }
  }, []);

  const handleEnterMuseum = () => {
    localStorage.setItem('museum-entered', 'true');
    setHasEntered(true);
    setCurrentView('home');
  };

  const handleNavigate = (view: string, slug?: string) => {
    setCurrentView(view as View);
    setCollectionSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin') {
    if (isAuthenticated) {
      return <AdminPanel onNavigate={handleNavigate} />;
    }
    return <AdminLogin onLoginSuccess={() => handleNavigate('admin-panel')} />;
  }

  if (currentView === 'admin-panel') {
    if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={() => handleNavigate('admin-panel')} />;
    }
    return <AdminPanel onNavigate={handleNavigate} />;
  }

  if (currentView === 'welcome' && !hasEntered) {
    return <Welcome onEnter={handleEnterMuseum} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {currentView !== 'gallery3d' && (
        <Navigation currentView={currentView} onNavigate={handleNavigate} />
      )}

      <main className="flex-grow">
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        {currentView === 'exhibitions' && (
          <Exhibitions collectionSlug={collectionSlug} onNavigate={handleNavigate} />
        )}
        {currentView === 'gallery3d' && <Gallery3D onNavigate={handleNavigate} />}
        {currentView === 'audioguides' && <AudioGuides onNavigate={handleNavigate} />}
        {currentView === 'about' && <About onNavigate={handleNavigate} />}
        {currentView === 'contact' && <Contact onNavigate={handleNavigate} />}
      </main>

      {currentView !== 'welcome' && currentView !== 'gallery3d' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
