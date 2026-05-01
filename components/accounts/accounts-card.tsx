import { Landmark, PiggyBank, CreditCard, TrendingUp, MoreVertical } from 'lucide-react';
import { cn } from '../../src/lib/utils';
import type { Account, AccountType } from '../../src/lib/types';

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const ACCOUNT_META: Record<AccountType, {
  label: string;
  Icon: React.ElementType;
  iconCls: string;
  badgeCls: string;
}> = {
  checking:   { label: 'Conta Corrente', Icon: Landmark,   iconCls: 'bg-violet-50 text-violet-600', badgeCls: 'bg-violet-50 text-violet-700 border-violet-200' },
  savings:    { label: 'Poupança',       Icon: PiggyBank,  iconCls: 'bg-green-50  text-green-600',  badgeCls: 'bg-green-50  text-green-700  border-green-200'  },
  credit:     { label: 'Cartão',         Icon: CreditCard, iconCls: 'bg-red-50    text-red-500',    badgeCls: 'bg-red-50    text-red-700    border-red-200'    },
  investment: { label: 'Investimento',   Icon: TrendingUp, iconCls: 'bg-blue-50   text-blue-600',   badgeCls: 'bg-blue-50   text-blue-700   border-blue-200'   },
};

interface Props { account: Account }

export function AccountCard({ account }: Props) {
  const meta = ACCOUNT_META[account.type];
  const isNegative = account.balance < 0;

  return (
    <div className="bg-white border border-gray-200 rounded p-4 flex flex-col gap-3 hover:border-violet-300 transition-colors">
     
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded flex items-center justify-center', meta.iconCls)}>
            <meta.Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{account.name}</p>
            <span className={cn(
              'inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border mt-0.5',
              meta.badgeCls
            )}>
              {meta.label}
            </span>
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors -mr-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

  
      <div className="border-t border-gray-100 pt-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Saldo atual</p>
        <p className={cn(
          'text-xl font-bold tabular-nums mt-0.5',
          isNegative ? 'text-red-600' : 'text-gray-900'
        )}>
          {fmt(account.balance)}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Atualizado em {new Date(account.updated_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}