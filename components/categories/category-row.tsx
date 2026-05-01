import { cn } from '../../src/lib/utils';
import type { Category } from '../../src/lib/types';

interface Props { category: Category }

export function CategoryRow({ category }: Props) {
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
            style={{ backgroundColor: category.color ?? '#94a3b8' }}
          />
          <span className="text-xs font-medium text-gray-800">{category.name}</span>
        </div>
      </td>
      <td className="px-3 py-2 text-right">
        <span className="text-[10px] font-mono text-gray-400">
          {category.color ?? '—'}
        </span>
      </td>
    </tr>
  );
}