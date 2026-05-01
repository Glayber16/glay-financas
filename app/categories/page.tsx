import { TrendingUp, TrendingDown } from 'lucide-react';
import { CategoryRow } from '@/components/categories/category-row';
import { NewCategoryModal } from '@/components/categories/new-category-modal';
import { fetchCategoriesAction } from '@/src/actions/category-actions';
import type { Category } from '@/src/lib/types';

interface SectionProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  headerCls: string;
  children: React.ReactNode;
}

function CategorySection({ title, count, icon, headerCls, children }: SectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className={`flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 ${headerCls}`}>
        {icon}
        <span className="text-xs font-semibold">{title}</span>
        <span className="ml-auto text-xs text-gray-400">
          {count} categoria{count !== 1 ? 's' : ''}
        </span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wide">Nome</th>
            <th className="text-right px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wide">Cor</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default async function CategoriesPage() {
  const response = await fetchCategoriesAction();
  const categories: Category[] = (response.data ?? []).map((c: any) => ({
    ...c,
    created_at: new Date(c.created_at).toISOString(),
  }));

  const incomeCategories  = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Categorias</h1>
          <p className="text-xs text-gray-500">
            {incomeCategories.length} receita{incomeCategories.length !== 1 ? 's' : ''} ·{' '}
            {expenseCategories.length} despesa{expenseCategories.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NewCategoryModal />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CategorySection
          title="Receitas"
          count={incomeCategories.length}
          icon={<TrendingUp className="w-3.5 h-3.5 text-green-600" />}
          headerCls="text-green-800 bg-green-50"
        >
          {incomeCategories.map((c) => <CategoryRow key={c.id} category={c} />)}
        </CategorySection>

        <CategorySection
          title="Despesas"
          count={expenseCategories.length}
          icon={<TrendingDown className="w-3.5 h-3.5 text-red-500" />}
          headerCls="text-red-800 bg-red-50"
        >
          {expenseCategories.map((c) => <CategoryRow key={c.id} category={c} />)}
        </CategorySection>
      </div>
    </div>
  );
}