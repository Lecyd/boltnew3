import { useEffect, useState } from 'react';
import { Play, Pause, Volume2, Clock, ArrowLeft } from 'lucide-react';
import { supabase, Collection, Artifact } from '../lib/supabase';

interface AudioGuidesProps {
  onNavigate: (view: string) => void;
}

export default function AudioGuides({ onNavigate }: AudioGuidesProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('order_index');

      if (collectionsError) throw collectionsError;
      setCollections(collectionsData || []);

      const { data: artifactsData, error: artifactsError } = await supabase
        .from('artifacts')
        .select('*');

      if (artifactsError) throw artifactsError;
      setArtifacts(artifactsData || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-300">
              Audio-guides
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Écoutez nos Guides Audio
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Laissez-vous guider par des narrations captivantes qui donnent vie à chaque objet
            de notre collection.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {collections.map((collection) => {
              const collectionArtifacts = artifacts.filter(
                (a) => a.collection_id === collection.id
              );

              if (collectionArtifacts.length === 0) return null;

              return (
                <div key={collection.id}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <div className="w-2 h-8 bg-amber-600 rounded-full mr-4" />
                    {collection.name}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {collectionArtifacts.map((artifact) => (
                      <div
                        key={artifact.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">🎧</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                              {artifact.title}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {artifact.origin} • {artifact.period}
                            </p>

                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                              {artifact.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => togglePlay(artifact.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                  playingId === artifact.id
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                }`}
                              >
                                {playingId === artifact.id ? (
                                  <>
                                    <Pause className="w-4 h-4" />
                                    <span>Pause</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4" />
                                    <span>Écouter</span>
                                  </>
                                )}
                              </button>

                              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>3:24</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {playingId === artifact.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-600 rounded-full animate-pulse" style={{ width: '45%' }} />
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-500">1:32</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <Volume2 className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Une expérience immersive
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Nos audio-guides ont été créés en collaboration avec des historiens et des experts
              culturels pour vous offrir une expérience éducative authentique et captivante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
