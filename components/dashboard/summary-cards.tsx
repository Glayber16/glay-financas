import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { DashboardSummary } from '../../src/lib/types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

interface Props { summary: DashboardSummary }

interface CardDef {
  label: string;
  value: string;
  sub: string;
  Icon: React.ElementType;
  accent: string;
  iconBg: string;
}

export function SummaryCards({ summary }: Props) {
  const cards: CardDef[] = [
    {
      label:  'Saldo Atual',
      value:  fmt(summary.current_balance),
      sub:    'Todas as contas',
      Icon:   Wallet,
      accent: 'border-l-violet-600',
      iconBg: 'bg-violet-50 text-violet-600',
    },
    {
      label:  'Receitas do Mês',
      value:  fmt(summary.monthly_income),
      sub:    'Abril 2025',
      Icon:   TrendingUp,
      accent: 'border-l-green-600',
      iconBg: 'bg-green-50 text-green-600',
    },
    {
      label:  'Despesas do Mês',
      value:  fmt(summary.monthly_expenses),
      sub:    'Abril 2025',
      Icon:   TrendingDown,
      accent: 'border-l-red-500',
      iconBg: 'bg-red-50 text-red-500',
    },
    {
      label:  'Previsto / Pendente',
      value:  fmt(summary.pending_amount),
      sub:    'Lançamentos futuros',
      Icon:   Clock,
      accent: 'border-l-amber-500',
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map(({ label, value, sub, Icon, accent, iconBg }) => (
        <div
          key={label}
          className={`bg-white border border-gray-200 border-l-4 ${accent} rounded p-4 flex items-start gap-3`}
        >
          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
            <p className="text-lg font-bold text-gray-900 tabular-nums leading-tight mt-0.5">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}