import type {
  Account,
  Category,
  Transaction,
  DashboardSummary,
  CashflowDataPoint,
} from './types';

export const mockAccounts: Account[] = [
  { id: 'acc-1', name: 'Nubank',      type: 'checking',   balance: 4820.50,  created_at: '2024-01-10T00:00:00Z', updated_at: '2025-04-28T00:00:00Z' },
  { id: 'acc-2', name: 'Poupança BB', type: 'savings',    balance: 12300.00, created_at: '2024-01-10T00:00:00Z', updated_at: '2025-04-28T00:00:00Z' },
  { id: 'acc-3', name: 'Cartão XP',   type: 'credit',     balance: -1450.75, created_at: '2024-03-01T00:00:00Z', updated_at: '2025-04-28T00:00:00Z' },
];

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Alimentação', type: 'expense', color: '#f97316', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-2', name: 'Transporte',  type: 'expense', color: '#3b82f6', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-3', name: 'Lazer',       type: 'expense', color: '#a855f7', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-4', name: 'Moradia',     type: 'expense', color: '#eab308', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-5', name: 'Salário',     type: 'income',  color: '#10b981', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-6', name: 'Freelance',   type: 'income',  color: '#06b6d4', created_at: '2024-01-10T00:00:00Z' },
];

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', account_id: 'acc-1', category_id: 'cat-5', installment_id: null, amount: 5500.00, type: 'income',  description: 'Salário Abril',         transaction_date: '2025-04-05', is_paid: true,  created_at: '2025-04-05T10:00:00Z', category_name: 'Salário',     account_name: 'Nubank'      },
  { id: 'tx-2', account_id: 'acc-1', category_id: 'cat-6', installment_id: null, amount: 1200.00, type: 'income',  description: 'Freela – Landing Page', transaction_date: '2025-04-12', is_paid: true,  created_at: '2025-04-12T14:00:00Z', category_name: 'Freelance',   account_name: 'Nubank'      },
  { id: 'tx-3', account_id: 'acc-3', category_id: 'cat-1', installment_id: null, amount: 380.90,  type: 'expense', description: 'Supermercado',          transaction_date: '2025-04-20', is_paid: true,  created_at: '2025-04-20T19:00:00Z', category_name: 'Alimentação', account_name: 'Cartão XP'   },
  { id: 'tx-4', account_id: 'acc-1', category_id: 'cat-4', installment_id: null, amount: 1200.00, type: 'expense', description: 'Aluguel',               transaction_date: '2025-04-10', is_paid: true,  created_at: '2025-04-10T09:00:00Z', category_name: 'Moradia',     account_name: 'Nubank'      },
  { id: 'tx-5', account_id: 'acc-3', category_id: 'cat-3', installment_id: 'i1', amount: 199.90,  type: 'expense', description: 'Monitor 4K (3/6)',      transaction_date: '2025-05-05', is_paid: false, created_at: '2025-04-01T00:00:00Z', category_name: 'Lazer',       account_name: 'Cartão XP'   },
];

export const mockTransactionsExtended: Transaction[] = [
  ...mockTransactions,
  { id: 'tx-6',  account_id: 'acc-1', category_id: 'cat-5', installment_id: null, amount: 5500.00, type: 'income',  description: 'Salário Março',        transaction_date: '2025-03-05', is_paid: true,  created_at: '2025-03-05T10:00:00Z', category_name: 'Salário',     category_color: '#10b981', account_name: 'Nubank'    },
  { id: 'tx-7',  account_id: 'acc-3', category_id: 'cat-2', installment_id: null, amount: 180.00,  type: 'expense', description: 'Combustível',          transaction_date: '2025-04-18', is_paid: true,  created_at: '2025-04-18T08:00:00Z', category_name: 'Transporte',  category_color: '#3b82f6', account_name: 'Cartão XP' },
  { id: 'tx-8',  account_id: 'acc-1', category_id: 'cat-4', installment_id: null, amount: 1200.00, type: 'expense', description: 'Aluguel Março',        transaction_date: '2025-03-10', is_paid: true,  created_at: '2025-03-10T09:00:00Z', category_name: 'Moradia',     category_color: '#eab308', account_name: 'Nubank'    },
  { id: 'tx-9',  account_id: 'acc-2', category_id: 'cat-6', installment_id: null, amount: 800.00,  type: 'income',  description: 'Freela – App Mobile',  transaction_date: '2025-04-25', is_paid: true,  created_at: '2025-04-25T11:00:00Z', category_name: 'Freelance',   category_color: '#06b6d4', account_name: 'Poupança BB'},
  { id: 'tx-10', account_id: 'acc-3', category_id: 'cat-1', installment_id: null, amount: 95.50,   type: 'expense', description: 'iFood',                transaction_date: '2025-04-28', is_paid: true,  created_at: '2025-04-28T20:00:00Z', category_name: 'Alimentação', category_color: '#f97316', account_name: 'Cartão XP' },
  { id: 'tx-11', account_id: 'acc-3', category_id: 'cat-3', installment_id: 'i1', amount: 199.90,  type: 'expense', description: 'Monitor 4K (4/6)',     transaction_date: '2025-06-05', is_paid: false, created_at: '2025-04-01T00:00:00Z', category_name: 'Lazer',       category_color: '#a855f7', account_name: 'Cartão XP' },
];

export const mockSummary: DashboardSummary = {
  current_balance: 15_669.75,
  monthly_income:   6_700.00,
  monthly_expenses: 2_140.80,
  pending_amount:     199.90,
};

export const mockCashflow: CashflowDataPoint[] = [
  { month: 'Nov', income: 5500,  expenses: 3100 },
  { month: 'Dez', income: 6200,  expenses: 4800 },
  { month: 'Jan', income: 5500,  expenses: 2900 },
  { month: 'Fev', income: 5500,  expenses: 3200 },
  { month: 'Mar', income: 7100,  expenses: 2750 },
  { month: 'Abr', income: 6700,  expenses: 2140 },
];