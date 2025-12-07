import { Candidate } from '@/lib/votingSystem';
import { User, Vote } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidate: Candidate) => void;
  disabled: boolean;
  hasVoted: boolean;
  isSelected?: boolean;
}

const CandidateCard = ({ candidate, onVote, disabled, hasVoted, isSelected }: CandidateCardProps) => {
  return (
    <div 
      className={`card-glass p-6 transition-all duration-300 ${
        isSelected ? 'ring-2 ring-success' : ''
      } ${disabled ? 'opacity-80' : 'hover:shadow-card-hover hover:-translate-y-1'}`}
    >
      {/* Candidate Avatar */}
      <div 
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${candidate.color}20` }}
      >
        <User className="w-10 h-10" style={{ color: candidate.color }} />
      </div>

      {/* Candidate Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-foreground mb-1">{candidate.name}</h3>
        <div 
          className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-primary-foreground"
          style={{ backgroundColor: candidate.color }}
        >
          {candidate.party}
        </div>
      </div>

      {/* Manifesto */}
      <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6 line-clamp-3">
        {candidate.manifesto}
      </p>

      {/* Vote Button */}
      {hasVoted ? (
        isSelected ? (
          <div className="w-full py-3 px-4 rounded-lg bg-success/10 text-success text-center font-medium text-sm flex items-center justify-center gap-2">
            <Vote className="w-4 h-4" />
            Your Vote
          </div>
        ) : (
          <div className="w-full py-3 px-4 rounded-lg bg-muted text-muted-foreground text-center text-sm">
            Voting Closed
          </div>
        )
      ) : (
        <button
          onClick={() => onVote(candidate)}
          disabled={disabled}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Vote className="w-4 h-4" />
          Vote for {candidate.name.split(' ')[0]}
        </button>
      )}
    </div>
  );
};

export default CandidateCard;
