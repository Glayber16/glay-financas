'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { CashflowDataPoint } from '../../src/lib/types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

interface Props { data: CashflowDataPoint[] }

export function CashflowChart({ data }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Fluxo de Caixa</h2>
        <p className="text-xs text-gray-400">Últimos 6 meses — Receitas vs Despesas</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={2} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            formatter={(value: any) => [fmt(value), '']}
            contentStyle={{
              fontSize: 12,
              border: '1px solid #e5e7eb',
              borderRadius: 4,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(v) => v === 'income' ? 'Receitas' : 'Despesas'}
          />
          <Bar dataKey="income"   name="income"   fill="#7c3aed" radius={[2, 2, 0, 0]} />
          <Bar dataKey="expenses" name="expenses" fill="#ef4444" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}