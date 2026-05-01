'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { TransactionFilters, type TransactionFilters as IFilters } from '@/components/transactions/transaction-filters';
import { TransactionsTable } from '@/components/transactions/transaction-table';
import { NewTransactionModal } from '@/components/transactions/new-transaction-modal';
import { fetchTransactionsByMonthAction } from '@/src/actions/transaction-actions';
import type { Account, Category, Transaction } from '@/src/lib/types';

interface Props {
  initialTransactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  initialYear: number;
  initialMonth: number;
}

export function TransactionsClient({
  initialTransactions,
  accounts,
  categories,
  initialYear,
  initialMonth,
}: Props) {
  const [filters, setFilters] = useState<IFilters>({
    year: initialYear,
    month: initialMonth,
    type: 'all',
    account_id: '',
    category_id: '',
  });

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    if (filters.year === initialYear && filters.month === initialMonth) {
      setTransactions(initialTransactions);
      return;
    }

    startTransition(async () => {
      const res = await fetchTransactionsByMonthAction(filters.year, filters.month);

      if (res.success && res.data) {
        const normalized = (res.data as Transaction[]).map((tx) => ({
          ...tx,
          transaction_date:
            typeof tx.transaction_date === 'string'
              ? tx.transaction_date.split('T')[0]
              : new Date(tx.transaction_date).toISOString().split('T')[0],
        }));

        setTransactions(normalized);
      } else {
        setTransactions([]);
      }
    });
  }, [filters.year, filters.month]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.type !== 'all' && tx.type !== filters.type) return false;
      if (filters.account_id && tx.account_id !== filters.account_id) return false;
      if (filters.category_id && tx.category_id !== filters.category_id) return false;
      return true;
    });
  }, [transactions, filters.type, filters.account_id, filters.category_id]);

  return (
    <div className="max-w-6xl mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Lançamentos</h1>
          <p className="text-xs text-gray-500">Histórico completo de movimentações</p>
        </div>
        <NewTransactionModal />
      </div>

      <TransactionFilters
        filters={filters}
        accounts={accounts}
        categories={categories}
        onChange={setFilters}
      />

      <TransactionsTable transactions={filtered} isLoading={isLoading} />
    </div>
  );
}