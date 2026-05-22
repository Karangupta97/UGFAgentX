import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const boxClass: Record<IconSize, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-lg',
  lg: 'w-12 h-12 rounded-xl',
  xl: 'w-[52px] h-[52px] rounded-[14px]',
};

const iconClass: Record<IconSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

export function LandingIconBox({
  icon: Icon,
  color,
  bg,
  size = 'md',
  className,
}: {
  icon: LucideIcon;
  color: string;
  bg?: string;
  size?: IconSize;
  className?: string;
}) {
  return (
    <div
      className={cn(boxClass[size], 'flex items-center justify-center shrink-0', className)}
      style={bg ? { background: bg } : undefined}
    >
      <Icon className={iconClass[size]} style={{ color }} strokeWidth={1.75} aria-hidden />
    </div>
  );
}

export function FlowNodeIcon({
  icon: Icon,
  color,
  bg,
}: {
  icon: LucideIcon;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: bg }}
    >
      <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.75} aria-hidden />
    </div>
  );
}
