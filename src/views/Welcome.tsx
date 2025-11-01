import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 inline-block">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-6xl">M</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Musée Virtuel
        </h1>

        <h2 className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 mb-6">
          du Patrimoine Culturel
        </h2>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Explorez les trésors du patrimoine culturel mondial à travers une expérience immersive
          et interactive. Découvrez l'artisanat, les costumes, la musique, l'architecture et les
          rituels qui façonnent notre humanité commune.
        </p>

        <button
          onClick={onEnter}
          className="group inline-flex items-center space-x-3 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span>Entrer dans le musée</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
          {['Artisanat', 'Costumes', 'Musique', 'Architecture', 'Rituels'].map((theme) => (
            <div key={theme} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{theme}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
