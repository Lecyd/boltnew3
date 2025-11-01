import { ArrowLeft, Target, Users, Globe, Heart } from 'lucide-react';

interface AboutProps {
  onNavigate: (view: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
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

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            À Propos du Musée
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Un espace virtuel dédié à la préservation et la célébration du patrimoine culturel mondial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Notre Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Rendre accessible le patrimoine culturel mondial à tous, partout dans le monde.
              Nous croyons que la culture est un bien commun qui doit être préservé, partagé
              et célébré au-delà des frontières géographiques.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Notre Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Créer un pont numérique entre les cultures, permettant à chacun de découvrir
              et d'apprécier la richesse de notre héritage commun. Utiliser la technologie
              pour rapprocher les peuples et préserver notre histoire collective.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Pour Qui
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Nos collections s'adressent aux étudiants, chercheurs, enseignants, passionnés
              d'histoire et à tous ceux qui souhaitent explorer et comprendre la diversité
              culturelle de notre monde.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Nos Valeurs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Authenticité, accessibilité, respect et éducation. Nous nous engageons à
              présenter les objets culturels avec précision et sensibilité, en honorant
              leur contexte et signification d'origine.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            L'Expérience Immersive
          </h2>

          <div className="max-w-4xl mx-auto space-y-6 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              Notre musée virtuel utilise les dernières technologies web pour offrir une
              expérience immersive unique. Grâce à la 3D interactive, aux audio-guides
              professionnels et aux contenus multimédias soigneusement sélectionnés, vous
              pouvez explorer le patrimoine culturel comme si vous y étiez.
            </p>

            <p className="leading-relaxed">
              Chaque objet de notre collection a été documenté avec soin, accompagné de
              descriptions détaillées, de contextes historiques et de narrations audio qui
              donnent vie aux artefacts. Nos quiz interactifs vous permettent de tester vos
              connaissances et d'approfondir votre compréhension.
            </p>

            <p className="leading-relaxed">
              Que vous soyez sur ordinateur, tablette ou smartphone, notre plateforme s'adapte
              à votre appareil pour vous offrir la meilleure expérience possible. Le mode
              sombre préserve vos yeux lors des longues sessions d'exploration nocturne.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Technologies Utilisées
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'React', desc: 'Interface utilisateur' },
              { name: 'Three.js', desc: 'Rendu 3D' },
              { name: 'Supabase', desc: 'Base de données' },
              { name: 'Tailwind', desc: 'Design moderne' },
              { name: 'TypeScript', desc: 'Code robuste' },
              { name: 'WebGL', desc: 'Graphiques 3D' },
              { name: 'Web Audio', desc: 'Son immersif' },
              { name: 'HTML5', desc: 'Standard web' },
            ].map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {tech.name.substring(0, 2)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {tech.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
