import { SummaryCards } from '../components/dashboard/summary-cards';
import { CashflowChart } from '@/components/dashboard/cashflow-chart';
import { RecentTransactionsTable } from '../components/dashboard/recent-transaction-table';
import { NewTransactionModal } from '@/components/transactions/new-transaction-modal';
import { fetchTransactionsByMonthAction } from '@/src/actions/transaction-actions';
import { fetchAccountsAction } from '@/src/actions/account-actions';


const summaryRes = await fetchTransactionsByMonthAction(2025, 4)
const accountsRes = await fetchAccountsAction()


export default function DashboardPage() {
  const now = new Date();
  const monthLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
 
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500 capitalize">{monthLabel}</p>
        </div>
        <NewTransactionModal />
      </div>

      <SummaryCards summary={mockSummary} />

  
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CashflowChart data={mockCashflow} />
        </div>
        <div className="xl:col-span-2">
          <RecentTransactionsTable transactions={mockTransactions} />
        </div>
      </div>
    </div>
  );
}