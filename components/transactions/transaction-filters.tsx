'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Account, Category, TransactionType } from '../../src/lib/types';

export interface TransactionFilters {
  year: number;
  month: number; // 1-12
  type: TransactionType | 'all';
  account_id: string;
  category_id: string;
}

interface Props {
  filters: TransactionFilters;
  accounts: Account[];
  categories: Category[];
  onChange: (filters: TransactionFilters) => void;
}

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const TYPE_OPTIONS: { value: TransactionFilters['type']; label: string }[] = [
  { value: 'all',     label: 'Todos'    },
  { value: 'income',  label: 'Receitas' },
  { value: 'expense', label: 'Despesas' },
];

export function TransactionFilters({ filters, accounts, categories, onChange }: Props) {
  function set<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function navigateMonth(dir: -1 | 1) {
    let m = filters.month + dir;
    let y = filters.year;
    if (m < 1)  { m = 12; y -= 1; }
    if (m > 12) { m = 1;  y += 1; }
    onChange({ ...filters, month: m, year: y });
  }

  const selectCls =
    'border border-gray-300 rounded px-2 py-1.5 text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500';

  const filteredCategories = filters.type === 'all'
    ? categories
    : categories.filter((c) => c.type === filters.type);

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded">

      <div className="flex items-center gap-1">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-semibold text-gray-800 w-32 text-center tabular-nums">
          {MONTHS[filters.month - 1]} {filters.year}
        </span>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

 
      <div className="flex rounded border border-gray-300 overflow-hidden">
        {TYPE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { set('type', value); set('category_id', ''); }}
            className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
              filters.type === value
                ? 'bg-violet-600 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-gray-200" />


      <select
        className={selectCls}
        value={filters.account_id}
        onChange={(e) => set('account_id', e.target.value)}
      >
        <option value="">Todas as contas</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        className={selectCls}
        value={filters.category_id}
        onChange={(e) => set('category_id', e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {(filters.type !== 'all' || filters.account_id || filters.category_id) && (
        <button
          onClick={() => onChange({
            ...filters, type: 'all', account_id: '', category_id: '',
          })}
          className="text-xs text-violet-600 hover:underline ml-1"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}