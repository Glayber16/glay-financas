import { ArrowUpRight, ArrowDownLeft, Clock, Layers } from 'lucide-react';
import { cn } from '../../src/lib/utils';
import type { Transaction } from '../../src/lib/types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });

interface Props {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionsTable({ transactions, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded">
        <div className="flex items-center justify-center h-48 text-xs text-gray-400">
          Carregando…
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded">
        <div className="flex flex-col items-center justify-center h-48 gap-1">
          <p className="text-sm font-medium text-gray-500">Nenhum lançamento encontrado</p>
          <p className="text-xs text-gray-400">Tente ajustar os filtros ou crie um novo lançamento.</p>
        </div>
      </div>
    );
  }

  // Totalizadores
  const totalIncome   = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense  = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net           = totalIncome - totalExpense;

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      {/* Totalizadores */}
      <div className="flex items-center gap-6 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs">
        <span className="text-gray-500">
          {transactions.length} lançamento{transactions.length !== 1 ? 's' : ''}
        </span>
        <span className="text-green-600 font-medium tabular-nums">
          Receitas: +{fmt(totalIncome)}
        </span>
        <span className="text-red-600 font-medium tabular-nums">
          Despesas: -{fmt(totalExpense)}
        </span>
        <span className={cn(
          'font-semibold tabular-nums ml-auto',
          net >= 0 ? 'text-green-700' : 'text-red-700'
        )}>
          Saldo: {net >= 0 ? '+' : ''}{fmt(net)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-2 font-medium text-gray-500 whitespace-nowrap">Data</th>
              <th className="text-left px-4 py-2 font-medium text-gray-500">Descrição</th>
              <th className="text-left px-4 py-2 font-medium text-gray-500">Categoria</th>
              <th className="text-left px-4 py-2 font-medium text-gray-500">Conta</th>
              <th className="text-right px-4 py-2 font-medium text-gray-500 whitespace-nowrap">Valor</th>
              <th className="text-center px-4 py-2 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-2.5 text-gray-500 tabular-nums whitespace-nowrap">
                  {fmtDate(tx.transaction_date)}
                </td>
                <td className="px-4 py-2.5 max-w-xs">
                  <div className="flex items-center gap-1.5">
                    {tx.type === 'income'
                      ? <ArrowUpRight className="w-3 h-3 text-green-500 shrink-0" />
                      : <ArrowDownLeft className="w-3 h-3 text-red-500 shrink-0" />
                    }
                    <span className="font-medium text-gray-800 truncate">
                      {tx.description}
                    </span>
                    {tx.installment_id && (
                      <span title="Parcelado">
                        <Layers className="w-3 h-3 text-violet-400 shrink-0" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {tx.category_color && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: tx.category_color }}
                      />
                    )}
                    <span className="text-gray-600">{tx.category_name ?? '—'}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                  {tx.account_name ?? '—'}
                </td>
                <td className={cn(
                  'px-4 py-2.5 text-right font-semibold tabular-nums whitespace-nowrap',
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {tx.is_paid ? (
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700 border border-green-200">
                      Pago
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-2.5 h-2.5" />Pendente
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}