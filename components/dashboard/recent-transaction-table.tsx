import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { Transaction } from '../../src/lib/types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });

interface Props { transactions: Transaction[] }

export function RecentTransactionsTable({ transactions }: Props) {
  const rows = [...transactions]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded overflow-x-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Últimos Lançamentos</h2>
        <a href="/transactions" className="text-xs text-violet-600 hover:underline">
          Ver todos →
        </a>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-2 font-medium text-gray-500">Data</th>
            <th className="text-left px-4 py-2 font-medium text-gray-500">Descrição</th>
            <th className="text-left px-4 py-2 font-medium text-gray-500">Categoria</th>
            <th className="text-left px-4 py-2 font-medium text-gray-500">Conta</th>
            <th className="text-right px-4 py-2 font-medium text-gray-500">Valor</th>
            <th className="text-center px-4 py-2 font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2.5 text-gray-500 tabular-nums whitespace-nowrap">
                {fmtDate(tx.transaction_date)}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  {tx.type === 'income'
                    ? <ArrowUpRight className="w-3 h-3 text-green-500 shrink-0" />
                    : <ArrowDownLeft className="w-3 h-3 text-red-500 shrink-0" />
                  }
                  <span className="font-medium text-gray-800 truncate max-w-40">
                    {tx.description}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2.5 text-gray-500">{tx.category_name ?? '—'}</td>
              <td className="px-4 py-2.5 text-gray-500">{tx.account_name ?? '—'}</td>
              <td className={cn(
                'px-4 py-2.5 text-right font-semibold tabular-nums',
                tx.type === 'income' ? 'text-green-600' : 'text-red-600'
              )}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </td>
              <td className="px-4 py-2.5 text-center">
                {tx.is_paid ? (
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700">
                    Pago
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                    <Clock className="w-2.5 h-2.5" /> Pendente
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}