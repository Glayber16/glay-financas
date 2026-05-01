import { pool, query } from '../db';
import { randomUUID } from 'crypto';

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  installment_id: string | null;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  transaction_date: string; 
  is_paid: boolean;
  created_at: string;
  category_name: string | null;
  category_color: string | null;
  account_name: string | null;
}

export type CreateTransactionDTO = {
  account_id: string;
  category_id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  transaction_date: string;
  is_paid: boolean;
  installment_id?: string | null;
};

interface TransactionRow extends Omit<Transaction, 'amount' | 'transaction_date' | 'created_at'> {
  amount: string;
  transaction_date: Date;
  created_at: Date;
}

function normalize(row: TransactionRow): Transaction {
  return {
    ...row,
    amount:           parseFloat(row.amount),
    transaction_date: row.transaction_date.toISOString().split('T')[0],
    created_at:       row.created_at.toISOString(),
  };
}

export async function getTransactionsByMonth(
  year: number,
  month: number,
): Promise<Transaction[]> {
  const sql = `
    SELECT
      t.id,
      t.account_id,
      t.category_id,
      t.installment_id,
      t.amount,
      t.type,
      t.description,
      t.transaction_date,
      t.is_paid,
      t.created_at,
      c.name  AS category_name,
      c.color AS category_color,
      a.name  AS account_name
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    LEFT JOIN accounts   a ON a.id = t.account_id
    WHERE EXTRACT(YEAR  FROM t.transaction_date) = $1
      AND EXTRACT(MONTH FROM t.transaction_date) = $2
    ORDER BY t.transaction_date DESC, t.created_at DESC;
  `;
  const rows = await query<TransactionRow>(sql, [year, month]);
  return rows.map(normalize);
}

export async function createSingleTransaction(
  data: CreateTransactionDTO,
): Promise<Transaction> {
  const sql = `
    INSERT INTO transactions
      (account_id, category_id, amount, type, description, transaction_date, is_paid)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const rows = await query<TransactionRow>(sql, [
    data.account_id,
    data.category_id,
    data.amount,
    data.type,
    data.description,
    data.transaction_date,
    data.is_paid,
  ]);
  return normalize(rows[0]);
}

export async function createInstallments(
  data: CreateTransactionDTO,
  totalInstallments: number,
): Promise<void> {
  const client = await pool.connect();
  const installmentId = randomUUID();

  try {
    await client.query('BEGIN');

    const sql = `
      INSERT INTO transactions
        (account_id, category_id, installment_id, amount, type, description, transaction_date, is_paid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    const baseDate = new Date(data.transaction_date + 'T12:00:00');

    for (let i = 1; i <= totalInstallments; i++) {
      const installmentDate = new Date(baseDate);
      installmentDate.setMonth(baseDate.getMonth() + (i - 1));

      await client.query(sql, [
        data.account_id,
        data.category_id,
        installmentId,
        data.amount,
        data.type,
        `${data.description} (${i}/${totalInstallments})`,
        installmentDate.toISOString().split('T')[0],
        i === 1 ? data.is_paid : false,
      ]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}