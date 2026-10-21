import { useState, useEffect, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { X, PackagePlus, Loader2 } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: { nombre: string; cantidad: number; precio: number }) => Promise<void>;
  initialData?: Product | null;
}

export const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProductModalProps) => {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setCantidad(initialData.cantidad);
      setPrecio(initialData.precio);
    } else {
      setNombre('');
      setCantidad('');
      setPrecio('');
    }
    setError(null);
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || cantidad === '' || precio === '') return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        nombre: nombre.trim(),
        cantidad: Number(cantidad),
        precio: Number(precio),
      });
      onClose();
    } catch (err: unknown) {
      console.error('Error al guardar producto:', err);
      setError('Ocurrió un error al guardar el producto. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <PackagePlus className="w-4 h-4 text-blue-400" />
            {initialData ? t('dashboard.modal_edit_title') : t('dashboard.modal_create_title')}
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {t('dashboard.modal_name_label')}
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Teclado Mecánico RGB"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t('dashboard.modal_quantity_label')}
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                disabled={isSubmitting}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t('dashboard.modal_price_label')}
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                disabled={isSubmitting}
                value={precio}
                onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {t('dashboard.modal_btn_cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white shadow-md shadow-blue-900/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{t('dashboard.modal_btn_save')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};