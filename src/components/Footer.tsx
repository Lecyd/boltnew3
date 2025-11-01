import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-2">
            <span>Créé avec</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>pour préserver notre patrimoine culturel</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()} Musée Virtuel du Patrimoine Culturel
          </p>
        </div>
      </div>
    </footer>
  );
}
