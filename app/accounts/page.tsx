import { AccountCard } from '../../components/accounts/accounts-card';
import { NewAccountModal } from '../../components/accounts/new-account-modal';
import { fetchAccountsAction } from '../../src/actions/account-actions';
import { Account } from '@/src/lib/types';

const response = await fetchAccountsAction();
const rawAccounts = response.data || [];

const accounts: Account[] = rawAccounts.map((acc: any) => ({
  ...acc,
  type: acc.type, 
  created_at: new Date(acc.created_at).toISOString(),
  updated_at: new Date(acc.updated_at).toISOString(),
}));
const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default async function AccountsPage() {
    
  return (
    
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Contas</h1>
          <p className="text-xs text-gray-500">
            {accounts.length} conta{accounts.length !== 1 ? 's' : ''} · Saldo consolidado:{' '}
            <span className={totalBalance >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {fmt(totalBalance)}
            </span>
          </p>
        </div>
        <NewAccountModal />
      </div>

     
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}