import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase, Collection } from '../lib/supabase';
import MuseumMap from '../components/MuseumMap';

interface HomeProps {
  onNavigate: (view: string, collectionSlug?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-300">
              Bienvenue dans votre musée virtuel
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explorez le Patrimoine Culturel
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Découvrez des collections uniques qui racontent l'histoire et la diversité culturelle
            de l'humanité à travers les âges.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onNavigate('exhibitions', collection.slug)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-48 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {collection.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                    {collection.theme}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {collection.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {collection.description}
                  </p>

                  <div className="flex items-center text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-2 transition-transform">
                    <span className="text-sm">Découvrir</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400 dark:group-hover:border-amber-600 rounded-xl transition-colors pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 mb-16">
          <MuseumMap
            collections={collections}
            onSelectCollection={(slug) => onNavigate('exhibitions', slug)}
          />
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Une expérience immersive unique
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Plongez dans une galerie 3D interactive, écoutez des audio-guides passionnants et
              testez vos connaissances avec nos quiz culturels.
            </p>
            <button
              onClick={() => onNavigate('gallery3d')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <span>Visiter la galerie 3D</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
