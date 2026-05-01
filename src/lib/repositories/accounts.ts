import { query } from '../db';
import type { AccountType } from '../types';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  created_at: string;
  updated_at: string;
}

export type CreateAccountDTO = Pick<Account, 'name' | 'type'>;

interface AccountRow extends Omit<Account, 'balance' | 'created_at' | 'updated_at'> {
  balance: string;
  created_at: Date;
  updated_at: Date;
}

function normalize(row: AccountRow): Account {
  return {
    ...row,
    balance:    parseFloat(row.balance),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

export async function getAccounts(): Promise<Account[]> {
  const rows = await query<AccountRow>(
    `SELECT * FROM accounts ORDER BY created_at DESC`,
  );
  return rows.map(normalize);
}

export async function getAccountById(id: string): Promise<Account | null> {
  const rows = await query<AccountRow>(
    `SELECT * FROM accounts WHERE id = $1`,
    [id],
  );
  return rows[0] ? normalize(rows[0]) : null;
}

export async function createAccount(data: CreateAccountDTO): Promise<Account> {
  const rows = await query<AccountRow>(
    `INSERT INTO accounts (name, type) VALUES ($1, $2) RETURNING *`,
    [data.name, data.type],
  );
  return normalize(rows[0]);
}