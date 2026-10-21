import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  LogOut,
  Clock,
  Boxes,
  DollarSign,
  Layers,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProductModal } from '../components/ProductModal';
import { useAuth } from '../context/AuthContext';
import { useSessionKeepAlive } from '../hooks/useSessionKeepAlive';
import { productsApi } from '../api/products.api';
import type { Product } from '../types/product';

export const DashboardView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Estados de datos y carga
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Cierre de sesión automático o manual
  const handleSessionExpired = useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  // Hook del temporizador y latidos keep-alive
  const { formattedTime, isLowTime } = useSessionKeepAlive({
    onSessionExpired: handleSessionExpired,
  });

  // Escuchar si el interceptor de Axios detecta una sesión expirada (401)
  useEffect(() => {
    const handleExpiredEvent = () => handleSessionExpired();
    window.addEventListener('session-expired', handleExpiredEvent);

    return () => {
      window.removeEventListener('session-expired', handleExpiredEvent);
    };
  }, [handleSessionExpired]);

  // Función para consultar productos de la sesión actual
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setLoadError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setLoadError('No se pudieron cargar los productos. Intenta de nuevo.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Carga inicial al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filtrado reactivo en tiempo real
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const productName = (p?.nombre || p?.name || '').toString();
      return productName.toLowerCase().includes(term);
    });
  }, [products, searchTerm]);

  // Métricas calculadas
  const stats = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + (Number(p?.cantidad) || 0), 0);
    const totalValue = products.reduce(
      (acc, p) => acc + (Number(p?.cantidad) || 0) * (Number(p?.precio) || 0),
      0,
    );
    return {
      totalItems: products.length,
      totalUnits,
      totalValue,
    };
  }, [products]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Creación y Edición persistidas en MongoDB
  const handleSaveProduct = async (productData: {
    nombre: string;
    cantidad: number;
    precio: number;
  }) => {
    if (editingProduct) {
      // PATCH /products/:id
      const response = await productsApi.update(editingProduct._id, productData);
      const resObj = response as Record<string, unknown>;
      const rawProduct = (resObj?.data ?? resObj?.product ?? response) as Product;

      const updatedProduct: Product = {
        ...editingProduct,
        ...rawProduct,
        nombre: rawProduct?.nombre || rawProduct?.name || productData.nombre,
      };

      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? updatedProduct : p)),
      );
    } else {
      // POST /products
      const response = await productsApi.create(productData);
      const resObj = response as Record<string, unknown>;
      const rawProduct = (resObj?.data ?? resObj?.product ?? response) as Product;

      const createdProduct: Product = {
        ...rawProduct,
        nombre: rawProduct?.nombre || rawProduct?.name || productData.nombre,
      };

      setProducts((prev) => [createdProduct, ...prev]);
    }
  };

  // Eliminación persistida en MongoDB
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(t('dashboard.delete_confirm'))) return;

    setDeletingId(id);
    try {
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('No se pudo eliminar el producto. Intenta nuevamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct({
      ...product,
      nombre: product.nombre || (product.name as string) || '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Barra de navegación superior */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                {t('dashboard.title')}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t('dashboard.subtitle')}
              </p>
            </div>
          </div>

          {/* Panel derecho: Temporizador reactivo, i18n y botón Logout */}
          <div className="flex items-center gap-3">
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                isLowTime
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 animate-pulse'
                  : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
              }`}
            >
              <Clock
                className={`w-3.5 h-3.5 ${
                  isLowTime ? 'text-rose-400' : 'text-amber-400'
                }`}
              />
              <span>{t('dashboard.session_time')}</span>
              <strong
                className={`font-semibold ${
                  isLowTime ? 'text-rose-200' : 'text-amber-200'
                }`}
              >
                {formattedTime}
              </strong>
            </div>

            <LanguageSelector />

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-600 border border-rose-800/30 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('dashboard.logout_button')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Tarjetas de estadísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-lg text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('dashboard.stat_total_items')}</p>
              <h2 className="text-xl font-bold text-white mt-0.5">{stats.totalItems}</h2>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-400">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('dashboard.stat_total_units')}</p>
              <h2 className="text-xl font-bold text-white mt-0.5">{stats.totalUnits}</h2>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-lg text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('dashboard.stat_total_value')}</p>
              <h2 className="text-xl font-bold text-white mt-0.5">
                ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>
        </section>

        {/* Error en carga si ocurre */}
        {loadError && (
          <div className="bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loadError}</span>
            </div>
            <button
              onClick={fetchProducts}
              className="underline hover:text-white font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Barra de herramientas: Búsqueda y Botón Nuevo */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('dashboard.search_placeholder')}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('dashboard.btn_new')}
          </button>
        </section>

        {/* Tabla responsiva */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden flex-1 flex flex-col">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-xs text-slate-400 font-medium">
                Cargando inventario de la sesión...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="p-3 bg-slate-800/50 rounded-full text-slate-500 mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-semibold text-slate-300">
                {t('dashboard.empty_title')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {t('dashboard.empty_desc')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('dashboard.table_name')}</th>
                    <th className="py-3 px-4">{t('dashboard.table_quantity')}</th>
                    <th className="py-3 px-4">{t('dashboard.table_price')}</th>
                    <th className="py-3 px-4">{t('dashboard.table_total')}</th>
                    <th className="py-3 px-4 text-right">{t('dashboard.table_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs">
                  {filteredProducts.map((product) => {
                    const displayName = product.nombre || product.name || 'Sin nombre';
                    const qty = Number(product.cantidad) || 0;
                    const price = Number(product.precio) || 0;
                    const isDeleting = deletingId === product._id;

                    return (
                      <tr
                        key={product._id}
                        className={`hover:bg-slate-800/30 transition-colors group ${
                          isDeleting ? 'opacity-40 pointer-events-none' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {displayName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                              qty <= 5
                                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {qty} un.
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          ${price.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          ${(qty * price).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(product)}
                              disabled={isDeleting}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={isDeleting}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                              title="Eliminar"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
};