'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { NewTransactionForm } from './new-transaction-form';

export function NewTransactionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Novo Lançamento
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
         
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />


          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Novo Lançamento</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <NewTransactionForm onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}