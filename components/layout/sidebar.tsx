'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Tag,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const NAV = [
  { href: '/',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/transactions', label: 'Lançamentos', icon: ArrowLeftRight  },
  { href: '/accounts',     label: 'Contas',      icon: Landmark        },
  { href: '/categories',   label: 'Categorias',  icon: Tag             },
  { href: '/settings',     label: 'Configurações', icon: Settings      },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-56 shrink-0 bg-violet-950 text-violet-100">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-violet-900">
        <div className="flex items-center justify-center w-7 h-7 rounded bg-violet-500">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">
          Fin<span className="text-violet-300">track</span>
        </span>
      </div>

    
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors',
                active
                  ? 'bg-violet-700 text-white'
                  : 'text-violet-300 hover:bg-violet-900 hover:text-white'
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-violet-900">
        <p className="text-[10px] text-violet-600">v0.1.0 · local</p>
      </div>
    </aside>
  );
}