import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  trend?: string;
  color?: string;
}

const StatCard = ({ icon, value, label, trend, color = 'primary' }: StatCardProps) => {
  return (
    <div className="card-glass p-6 flex items-start gap-4">
      <div 
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          color === 'success' ? 'bg-success/10 text-success' :
          color === 'warning' ? 'bg-warning/10 text-warning' :
          color === 'accent' ? 'bg-accent/10 text-accent' :
          'bg-primary/10 text-primary'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {trend && (
          <p className="text-xs text-success mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
