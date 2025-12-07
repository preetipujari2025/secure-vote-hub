import { CANDIDATES, getCandidateById } from '@/lib/votingSystem';

interface BarChartProps {
  data: Record<string, number>;
  total: number;
}

const BarChart = ({ data, total }: BarChartProps) => {
  const maxVotes = Math.max(...Object.values(data), 1);

  return (
    <div className="space-y-4">
      {CANDIDATES.map((candidate) => {
        const votes = data[candidate.id] || 0;
        const percentage = total > 0 ? ((votes / total) * 100).toFixed(1) : '0.0';
        const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;

        return (
          <div key={candidate.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: candidate.color }}
                />
                <span className="font-medium text-foreground">{candidate.name}</span>
                <span className="text-xs text-muted-foreground">({candidate.party})</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-foreground">{votes}</span>
                <span className="text-muted-foreground"> votes ({percentage}%)</span>
              </div>
            </div>
            <div className="h-8 bg-muted rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                style={{ 
                  width: `${barWidth}%`,
                  backgroundColor: candidate.color,
                  minWidth: votes > 0 ? '40px' : '0'
                }}
              >
                {votes > 0 && (
                  <span className="text-xs font-bold text-primary-foreground">{votes}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;
