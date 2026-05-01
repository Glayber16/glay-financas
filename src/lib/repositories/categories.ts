import { query } from '../db';
import type { CategoryType } from '../types';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string | null;
  created_at: string;
}

export type CreateCategoryDTO = Pick<Category, 'name' | 'type' | 'color'>;

interface CategoryRow extends Omit<Category, 'created_at'> {
  created_at: Date;
}

function normalize(row: CategoryRow): Category {
  return { ...row, created_at: row.created_at.toISOString() };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await query<CategoryRow>(
    `SELECT * FROM categories ORDER BY type ASC, name ASC`,
  );
  return rows.map(normalize);
}

export async function getCategoriesByType(type: CategoryType): Promise<Category[]> {
  const rows = await query<CategoryRow>(
    `SELECT * FROM categories WHERE type = $1 ORDER BY name ASC`,
    [type],
  );
  return rows.map(normalize);
}

export async function createCategory(data: CreateCategoryDTO): Promise<Category> {
  const rows = await query<CategoryRow>(
    `INSERT INTO categories (name, type, color) VALUES ($1, $2, $3) RETURNING *`,
    [data.name, data.type, data.color ?? null],
  );
  return normalize(rows[0]);
}