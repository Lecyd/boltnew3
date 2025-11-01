import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Welcome from './views/Welcome';
import Home from './views/Home';
import Exhibitions from './views/Exhibitions';
import Gallery3D from './views/Gallery3D';
import AudioGuides from './views/AudioGuides';
import About from './views/About';
import Contact from './views/Contact';

type View = 'welcome' | 'home' | 'exhibitions' | 'gallery3d' | 'audioguides' | 'about' | 'contact';

function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [collectionSlug, setCollectionSlug] = useState<string | undefined>();
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const entered = localStorage.getItem('museum-entered');
    if (entered === 'true') {
      setHasEntered(true);
      setCurrentView('home');
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

  if (currentView === 'welcome' && !hasEntered) {
    return (
      <ThemeProvider>
        <Welcome onEnter={handleEnterMuseum} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
