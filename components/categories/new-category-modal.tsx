'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import type { CategoryType, CreateCategoryDTO  } from '@/src/lib/types';
import { createCategoryAction } from '@/src/actions/category-actions';

interface Props { onSuccess?: () => void }

const PRESET_COLORS = [
  '#10b981','#06b6d4','#3b82f6','#8b5cf6',
  '#f97316','#ef4444','#eab308','#ec4899',
];

export function NewCategoryModal({ onSuccess }: Props) {
  const [open, setOpen]   = useState(false);
  const [name, setName]   = useState('');
  const [type, setType]   = useState<CategoryType>('expense');
  const [color, setColor] = useState<string>('#8b5cf6');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setOpen(false);
    setName('');
    setType('expense');
    setColor('#8b5cf6');
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Informe o nome.'); return; }

    const dto: CreateCategoryDTO = { name: name.trim(), type, color };
    startTransition(async () => {
      const result = await createCategoryAction(dto);
      if (!result.success) { setError(result.error ?? 'Erro.'); return; }
      console.log('Nova categoria →', dto);
      onSuccess?.();
      handleClose();
    });
  }

  const inputCls = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Nova Categoria
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Nova Categoria</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
     
              <div>
                <label className={labelCls}>Nome</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Ex: Alimentação, Salário…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

       
              <div>
                <label className={labelCls}>Tipo</label>
                <div className="flex rounded border border-gray-300 overflow-hidden">
                  {(['expense', 'income'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                        type === t
                          ? t === 'income' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {t === 'income' ? '↑ Receita' : '↓ Despesa'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Cor (opcional)</label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? '#1e1e2e' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-200"
                    title="Cor personalizada"
                  />
                  <span className="text-[10px] font-mono text-gray-400">{color}</span>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold py-2 rounded transition-colors"
              >
                {isPending ? 'Salvando…' : 'Criar Categoria'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}