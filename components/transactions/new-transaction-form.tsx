'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Account, Category, TransactionType, CreateTransactionDTO, ActionResult } from '@/src/lib/types';
import { createTransactionAction } from '@/src/actions/transaction-actions';
import { fetchAccountsAction } from '@/src/actions/account-actions';
import { fetchCategoriesByTypeAction } from '@/src/actions/category-actions';

const fmtInstallment = (v: string, n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format((parseFloat(v.replace(',', '.')) || 0) / n);

interface Props { onSuccess?: () => void }

interface FormState {
  type: TransactionType;
  account_id: string;
  category_id: string;
  amount: string;
  description: string;
  transaction_date: string;
  is_paid: boolean;
  installments: number;
}

const DEFAULT_STATE: FormState = {
  type: 'expense',
  account_id: '',
  category_id: '',
  amount: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
  is_paid: true,
  installments: 1,
};

export function NewTransactionForm({ onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingCats, setLoadingCats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountsAction().then((res) => {
      if (res.success && res.data) setAccounts(res.data as Account[]);
    }).finally(() => setLoadingAccounts(false));
  }, []);

  useEffect(() => {
    setLoadingCats(true);
    setCategories([]);
    setForm((f) => ({ ...f, category_id: '' }));

    fetchCategoriesByTypeAction(form.type)
      .then((res) => {
        if (res.success && res.data) setCategories(res.data as Category[]);
      })
      .finally(() => setLoadingCats(false));
  }, [form.type]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(form.amount.replace(',', '.'));

    if (isNaN(amount) || amount <= 0) {
      setError('Informe um valor válido.');
      return;
    }

    if (!form.account_id || !form.category_id) {
      setError('Selecione conta e categoria.');
      return;
    }

    const dto: CreateTransactionDTO = {
      account_id: form.account_id,
      category_id: form.category_id,
      amount,
      type: form.type,
      description: form.description.trim(),
      transaction_date: form.transaction_date,
      is_paid: form.is_paid,
    };

    startTransition(async () => {
      const result: ActionResult = await createTransactionAction(dto, form.installments);

      if (!result.success) {
        setError(result.error ?? 'Erro ao salvar.');
        return;
      }

      router.refresh();
      onSuccess?.();
    });
  }

  const inputCls = 'w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400';

  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className={labelCls}>Tipo</p>
        <div className="flex rounded border border-gray-300 overflow-hidden">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set('type', t)}
              className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                form.type === t
                  ? t === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {t === 'income' ? '↑ Receita' : '↓ Despesa'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Conta</label>
          <select
            className={inputCls}
            value={form.account_id}
            onChange={(e) => set('account_id', e.target.value)}
            disabled={loadingAccounts}
            required
          >
            <option value="">{loadingAccounts ? 'Carregando...' : 'Selecione…'}</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Categoria</label>
          <select
            className={inputCls}
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}
            disabled={loadingCats}
            required
          >
            <option value="">{loadingCats ? 'Carregando...' : 'Selecione…'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Valor (R$)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            className={inputCls}
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Parcelas</label>
          <input
            type="number"
            min={1}
            max={48}
            className={inputCls}
            value={form.installments}
            onChange={(e) => set('installments', Math.max(1, Number(e.target.value)))}
          />
          {form.installments > 1 && form.amount && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              {form.installments}× de {fmtInstallment(form.amount, form.installments)}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={labelCls}>Descrição</label>
        <input
          type="text"
          className={inputCls}
          placeholder="Ex: Supermercado, Salário…"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Data</label>
          <input
            type="date"
            className={inputCls}
            value={form.transaction_date}
            onChange={(e) => set('transaction_date', e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <div className="flex rounded border border-gray-300 overflow-hidden">
            {([true, false] as const).map((paid) => (
              <button
                key={String(paid)}
                type="button"
                onClick={() => set('is_paid', paid)}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                  form.is_paid === paid
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {paid ? 'Pago' : 'Pendente'}
              </button>
            ))}
          </div>
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
        {isPending
          ? 'Salvando…'
          : form.installments > 1
            ? `Criar ${form.installments} parcelas`
            : 'Salvar Lançamento'}
      </button>
    </form>
  );
}