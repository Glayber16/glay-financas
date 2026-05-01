export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';
export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  installment_id: string | null;
  amount: number;
  type: TransactionType;
  description: string;
  transaction_date: string;
  is_paid: boolean;
  created_at: string;

  category_name?: string;
  category_color?: string | null;
  account_name?: string;
}

export interface DashboardSummary {
  current_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  pending_amount: number; 
}

export interface CashflowDataPoint {
  month: string; 
  income: number;
  expenses: number;
}


export interface CreateAccountDTO {
  name: string;
  type: AccountType;
}

export interface CreateTransactionDTO {
  account_id: string;
  category_id: string;
  amount: number;
  type: TransactionType;
  description: string;
  transaction_date: string;
  is_paid: boolean;
  installment_id?: string | null;
}

export interface CreateCategoryDTO {
  name: string;
  type: CategoryType;
  color: string | null;
}


export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}