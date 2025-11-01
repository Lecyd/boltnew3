import { useEffect, useState } from 'react';
import { ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';
import { supabase, Collection, Artifact, Quiz as QuizType } from '../lib/supabase';
import Quiz from '../components/Quiz';

interface ExhibitionsProps {
  collectionSlug?: string;
  onNavigate: (view: string) => void;
}

export default function Exhibitions({ collectionSlug, onNavigate }: ExhibitionsProps) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (collectionSlug) {
      loadExhibition();
    }
  }, [collectionSlug]);

  const loadExhibition = async () => {
    try {
      setLoading(true);

      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('slug', collectionSlug)
        .maybeSingle();

      if (collectionError) throw collectionError;
      setCollection(collectionData);

      if (collectionData) {
        const { data: artifactsData, error: artifactsError } = await supabase
          .from('artifacts')
          .select('*')
          .eq('collection_id', collectionData.id);

        if (artifactsError) throw artifactsError;
        setArtifacts(artifactsData || []);

        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('collection_id', collectionData.id)
          .maybeSingle();

        if (quizError) throw quizError;
        setQuiz(quizData);
      }
    } catch (error) {
      console.error('Error loading exhibition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioToggle = (artifactId: string) => {
    if (audioPlaying === artifactId) {
      setAudioPlaying(null);
    } else {
      setAudioPlaying(artifactId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'exposition...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Exposition non trouvée</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-4 text-amber-600 hover:text-amber-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux collections</span>
        </button>

        <div className="mb-12">
          <div className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <span className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              {collection.theme}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {collection.name}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            {collection.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedArtifact(artifact)}
            >
              <div className="h-56 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <div className="text-6xl">🏺</div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {artifact.title}
                </h3>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {artifact.origin && <span>{artifact.origin}</span>}
                  {artifact.origin && artifact.period && <span>•</span>}
                  {artifact.period && <span>{artifact.period}</span>}
                </div>

                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {artifact.description}
                </p>

                {artifact.audio_guide_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudioToggle(artifact.id);
                    }}
                    className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    {audioPlaying === artifact.id ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span className="text-sm font-medium">Pause audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span className="text-sm font-medium">Audio-guide</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {quiz && (
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {quiz.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Testez vos connaissances sur cette collection avec notre quiz interactif
            </p>
            <button
              onClick={() => setShowQuiz(true)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Commencer le quiz
            </button>
          </div>
        )}
      </div>

      {selectedArtifact && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArtifact(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedArtifact.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    {selectedArtifact.origin && <span>{selectedArtifact.origin}</span>}
                    {selectedArtifact.origin && selectedArtifact.period && <span>•</span>}
                    {selectedArtifact.period && <span>{selectedArtifact.period}</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArtifact(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div className="h-64 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                  <div className="text-8xl">🏺</div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {selectedArtifact.description}
              </p>

              {selectedArtifact.audio_guide_url && (
                <div className="flex items-center space-x-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Volume2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Audio-guide disponible
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Écoutez une description détaillée
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                    Écouter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showQuiz && quiz && collection && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowQuiz(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Quiz quiz={quiz} collectionId={collection.id} onClose={() => setShowQuiz(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
