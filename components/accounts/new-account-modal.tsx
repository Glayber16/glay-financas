'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import type { AccountType, CreateAccountDTO } from '../../src/lib/types';

import { createAccountAction } from '../../src/actions/account-actions';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking',   label: 'Conta Corrente' },
  { value: 'savings',    label: 'Poupança'       },
  { value: 'credit',     label: 'Cartão'         },
  { value: 'investment', label: 'Investimento'   },
];

interface Props { onSuccess?: () => void }

export function NewAccountModal({ onSuccess }: Props) {
  const [open, setOpen]           = useState(false);
  const [name, setName]           = useState('');
  const [type, setType]           = useState<AccountType>('checking');
  const [error, setError]         = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setOpen(false);
    setName('');
    setType('checking');
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Informe o nome da conta.'); return; }
    setError(null);

    const dto: CreateAccountDTO = { name: name.trim(), type };

    startTransition(async () => {
      const result = await createAccountAction(dto);
      if (!result.success) { setError(result.error ?? 'Erro ao salvar.'); return; }
      console.log('Nova conta →', dto);
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
        <Plus className="w-3.5 h-3.5" /> Nova Conta
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Nova Conta</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className={labelCls}>Nome da Conta</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Ex: Nubank, Poupança BB…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Tipo</label>
                <select
                  className={inputCls}
                  value={type}
                  onChange={(e) => setType(e.target.value as AccountType)}
                >
                  {ACCOUNT_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
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
                {isPending ? 'Salvando…' : 'Criar Conta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}