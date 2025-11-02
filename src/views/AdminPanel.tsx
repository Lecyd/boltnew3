import { useState, useEffect } from 'react';
import { LogOut, Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Music, Shirt, Building, Sparkles } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase, Collection, Artifact } from '../lib/supabase';

interface AdminPanelProps {
  onNavigate: (view: string) => void;
}

type TabType = 'artifacts' | 'galleries';

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('artifacts');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [galleries, setGalleries] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data: collectionsData } = await supabase
        .from('collections')
        .select('*')
        .order('order_index');
      setCollections(collectionsData || []);

      const { data: artifactsData } = await supabase
        .from('artifacts')
        .select('*')
        .order('created_at', { ascending: false });

      const regularArtifacts = artifactsData?.filter(a => !a.model_3d_url) || [];
      const galleryItems = artifactsData?.filter(a => a.model_3d_url) || [];

      setArtifacts(regularArtifacts);
      setGalleries(galleryItems);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await supabase.from('artifacts').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('artifacts')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('artifacts').insert([formData]);
        if (error) throw error;
      }

      setShowForm(false);
      setEditingItem(null);
      await loadData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'artisanat': return <ImageIcon className="w-4 h-4" />;
      case 'musique': return <Music className="w-4 h-4" />;
      case 'costume': return <Shirt className="w-4 h-4" />;
      case 'architecture': return <Building className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Panneau d'Administration
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez les contenus du musée
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>

        <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('artifacts')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'artifacts'
                ? 'border-b-2 border-amber-600 text-amber-600 dark:text-amber-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Artefacts
          </button>
          <button
            onClick={() => setActiveTab('galleries')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'galleries'
                ? 'border-b-2 border-amber-600 text-amber-600 dark:text-amber-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Galeries 3D
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter {activeTab === 'artifacts' ? 'un artefact' : 'une galerie 3D'}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      Libellé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(activeTab === 'artifacts' ? artifacts : galleries).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {item.image_url ? (
                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              {getCategoryIcon(item.category || '')}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.label || item.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300">
                          {getCategoryIcon(item.category || '')}
                          <span>{item.category || 'Non défini'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.updated_at || item.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(activeTab === 'artifacts' ? artifacts : galleries).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucun élément à afficher
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ItemForm
          item={editingItem}
          collections={collections}
          isGallery={activeTab === 'galleries'}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

interface ItemFormProps {
  item: any;
  collections: Collection[];
  isGallery: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
}

function ItemForm({ item, collections, isGallery, onSave, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState({
    label: item?.label || item?.title || '',
    title: item?.title || '',
    category: item?.category || '',
    description: item?.description || '',
    audio_guide_url: item?.audio_guide_url || '',
    image_url: item?.image_url || '',
    model_3d_url: item?.model_3d_url || '',
    collection_id: item?.collection_id || collections[0]?.id || '',
    origin: item?.origin || '',
    period: item?.period || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      title: formData.title || formData.label,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {item ? 'Modifier' : 'Ajouter'} {isGallery ? 'une galerie 3D' : 'un artefact'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Libellé *
              </label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
              >
                <option value="">Sélectionner</option>
                <option value="Artisanat">Artisanat</option>
                <option value="Musique">Musique</option>
                <option value="Costume">Costume</option>
                <option value="Architecture">Architecture</option>
                <option value="Rituels">Rituels</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Collection *
            </label>
            <select
              required
              value={formData.collection_id}
              onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Description (texte) *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Description audio (URL)
            </label>
            <input
              type="url"
              value={formData.audio_guide_url}
              onChange={(e) => setFormData({ ...formData, audio_guide_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Image (URL)
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {isGallery && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Fichier 3D (URL GLB/glTF) *
              </label>
              <input
                type="url"
                required
                value={formData.model_3d_url}
                onChange={(e) => setFormData({ ...formData, model_3d_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
                placeholder="https://example.com/model.glb"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Origine
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Période
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Enregistrer</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
