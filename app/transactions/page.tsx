import { fetchAccountsAction } from '../../src/actions/account-actions';
import { fetchCategoriesAction } from '../../src/actions/category-actions';
import { TransactionsClient } from '../../components/transactions/transaction-client';
import { fetchTransactionsByMonthAction } from '../../src/actions/transaction-actions';
import type { Account, Category, Transaction } from '../../src/lib/types';

interface PageProps {
  searchParams: { year?: string; month?: string };
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const now = new Date();
  
  const year = searchParams.year ? parseInt(searchParams.year, 10) : now.getFullYear();
  const month = searchParams.month ? parseInt(searchParams.month, 10) : now.getMonth() + 1;

  const [accRes, catRes, txRes] = await Promise.all([
    fetchAccountsAction(),
    fetchCategoriesAction(),
    fetchTransactionsByMonthAction(year, month)
  ]);

  const accounts: Account[] = (accRes.data || []).map((a: any) => ({
    ...a,
    created_at: new Date(a.created_at).toISOString(),
    updated_at: new Date(a.updated_at).toISOString(),
  }));

  const categories: Category[] = (catRes.data || []).map((c: any) => ({
    ...c,
    created_at: new Date(c.created_at).toISOString(),
    updated_at: new Date(c.updated_at).toISOString(),
  }));

  const transactions: Transaction[] = (txRes.data || []).map((tx: any) => ({
    ...tx,
    transaction_date: new Date(tx.transaction_date).toISOString().split('T')[0],
    created_at: new Date(tx.created_at).toISOString(),
    updated_at: new Date(tx.updated_at).toISOString(),
  }));

  return (
    <TransactionsClient 
      initialTransactions={transactions} 
      accounts={accounts} 
      categories={categories} 
      initialYear={year}
      initialMonth={month}
    />
  );
}